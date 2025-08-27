'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Todo } from '@/types/todo';
import { todoApi } from '@/services/todoApi';
import TodoForm from './TodoForm';
import DeleteConfirmation from './DeleteConfirmation';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTodos = await todoApi.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTodos();
  }, []);

  // Create todo
  const handleCreateTodo = async (data: { title: string; description: string }) => {
    setIsSubmitting(true);
    try {
      const newTodo = await todoApi.createTodo(data);
      setTodos(prev => [...prev, newTodo]);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update todo
  const handleUpdateTodo = async (data: { title: string; description: string }) => {
    if (!editingTodo) return;
    
    setIsSubmitting(true);
    try {
      const updatedTodo = await todoApi.updateTodo(editingTodo.id, data);
      setTodos(prev => prev.map(todo => 
        todo.id === editingTodo.id ? updatedTodo : todo
      ));
      setEditingTodo(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async () => {
    if (!deletingTodo) return;
    
    setIsSubmitting(true);
    try {
      await todoApi.deleteTodo(deletingTodo.id);
      setTodos(prev => prev.filter(todo => todo.id !== deletingTodo.id));
      setDeletingTodo(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-700">{error}</div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-500"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchTodos}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Todo
            </button>
          </div>
        </div>

        {/* Todo list */}
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {todos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first todo.</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Todo
              </button>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {todo.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {todo.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      ID: {todo.id}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit todo"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingTodo(todo)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Todo Form */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTodo}
        isLoading={isSubmitting}
      />

      {/* Edit Todo Form */}
      {editingTodo && (
        <TodoForm
          todo={editingTodo}
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          onSubmit={handleUpdateTodo}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation */}
      {deletingTodo && (
        <DeleteConfirmation
          isOpen={!!deletingTodo}
          onClose={() => setDeletingTodo(null)}
          onConfirm={handleDeleteTodo}
          title={deletingTodo.title}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
