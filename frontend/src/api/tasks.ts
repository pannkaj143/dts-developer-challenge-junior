import type {CreateTaskPayload, CreateTaskResponse} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function createTask(payload: CreateTaskPayload): Promise<CreateTaskResponse> {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage =
      typeof errorBody.message === 'string' ? errorBody.message : 'Failed to create task';
    throw new Error(errorMessage);
  }

  return response.json();
}
