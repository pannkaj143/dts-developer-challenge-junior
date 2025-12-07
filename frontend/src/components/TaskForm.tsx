import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {createTask} from '../api/tasks';
import {statusOptions, type Task} from '../types';

const DEFAULT_DUE_OFFSET_MINUTES = 60;

const toLocalDateTimeInputValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(1000, 'Description must be under 1000 characters').optional(),
  status: z.enum(statusOptions),
  dueDateTime: z
    .string()
    .min(1, 'Due date/time is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Enter a valid date and time'
    })
    .refine((value) => Date.parse(value) > Date.now(), {
      message: 'Due date/time must be in the future'
    })
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

const getInitialValues = (): FormValues => ({
  title: '',
  description: '',
  status: 'NEW',
  dueDateTime: toLocalDateTimeInputValue(
    new Date(Date.now() + DEFAULT_DUE_OFFSET_MINUTES * 60_000)
  )
});

export function TaskForm({onTaskCreated}: TaskFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues()
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmissionError(null);
      const isoDueDate = new Date(values.dueDateTime).toISOString();

      const payload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        status: values.status,
        dueDateTime: isoDueDate
      };

      const response = await createTask(payload);
      onTaskCreated(response.data);
      reset({...getInitialValues(), status: values.status});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setSubmissionError(message);
    }
  });

  const minimumDueDate = toLocalDateTimeInputValue(new Date());

  return (
    <form onSubmit={onSubmit} noValidate>
      <label>
        Title
        <input type="text" {...register('title')} placeholder="Write a descriptive title" />
        {errors.title && <span className="error-text">{errors.title.message}</span>}
      </label>

      <label>
        Description
        <textarea {...register('description')} placeholder="Provide optional context" />
        {errors.description && <span className="error-text">{errors.description.message}</span>}
      </label>

      <label>
        Status
        <select {...register('status')}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {errors.status && <span className="error-text">{errors.status.message}</span>}
      </label>

      <label>
        Due date / time
        <input type="datetime-local" min={minimumDueDate} {...register('dueDateTime')} />
        {errors.dueDateTime && <span className="error-text">{errors.dueDateTime.message}</span>}
      </label>

      {submissionError && <span className="error-text">{submissionError}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating task...' : 'Create task'}
      </button>
    </form>
  );
}
