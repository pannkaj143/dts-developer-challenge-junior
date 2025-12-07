export const statusOptions = ['NEW', 'IN_PROGRESS', 'DONE'] as const;

export type TaskStatus = (typeof statusOptions)[number];

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDateTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDateTime: string;
}

export interface CreateTaskResponse {
  message: string;
  data: Task;
}
