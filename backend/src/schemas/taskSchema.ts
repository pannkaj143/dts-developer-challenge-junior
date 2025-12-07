import {z} from 'zod';

export const statusValues = ['NEW', 'IN_PROGRESS', 'DONE'] as const;

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().trim().optional().nullable(),
  status: z.enum(statusValues, {
    errorMap: () => ({message: 'Status must be one of NEW, IN_PROGRESS, DONE'})
  }),
  dueDateTime: z
    .string({required_error: 'Due date/time is required'})
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Due date/time must be a valid ISO-8601 date string'
    })
    .refine((value) => Date.parse(value) > Date.now(), {
      message: 'Due date/time must be in the future'
    })
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
