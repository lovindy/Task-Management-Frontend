export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  listId: string;
  position: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}

export interface UpdateTaskPositionDto {
  newPosition: number;
}
