import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo';

const API_BASE_URL = 'http://localhost:5000';

export const todoApi = {
  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  // Get single todo
  async getTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  // Create new todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  // Complete todo
  async completeTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/complete`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to complete todo');
    }
    return response.json();
  },

  // Uncomplete todo
  async uncompleteTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/uncomplete`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to uncomplete todo');
    }
    return response.json();
  },

  // Archive todo
  async archiveTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/archive`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to archive todo');
    }
    return response.json();
  },
  
  // Update todo
  async updateTodo(id: number, todo: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  // Delete todo
  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
};
