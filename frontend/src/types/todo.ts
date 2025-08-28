export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  completed_at?: string;
  archived_at?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
}

export interface UpdateTodoRequest {
  title: string;
  description: string;
}
