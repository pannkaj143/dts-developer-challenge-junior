import {describe, it, expect, vi, beforeEach, afterEach, type SpyInstance} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockTaskResponse = {
  message: 'Task created successfully',
  data: {
    id: 1,
    title: 'Prepare bundle',
    description: 'Compile evidence for review',
    status: 'NEW',
    dueDateTime: '2030-05-01T10:00:00.000Z',
    createdAt: '2030-04-01T09:00:00.000Z',
    updatedAt: '2030-04-01T09:00:00.000Z'
  }
};

describe('App', () => {
  let fetchMock: SpyInstance;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockTaskResponse
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits the form and surfaces task details', async () => {
    const user = userEvent.setup();
    render(<App />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Prepare bundle');

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Compile evidence for review');

    const dueDateInput = screen.getByLabelText(/due date/i);
    await user.clear(dueDateInput);
    await user.type(dueDateInput, '2030-05-01T11:00');

    await user.click(screen.getByRole('button', {name: /create task/i}));

    const successBanner = await screen.findByRole('status');
    expect(successBanner).toHaveTextContent(/task created/i);

    expect(await screen.findByText(/latest task details/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/tasks'),
      expect.objectContaining({method: 'POST'})
    );
  });

  it('prevents submission when due date is in the past', async () => {
    const user = userEvent.setup();
    render(<App />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Review case notes');

    const dueDateInput = screen.getByLabelText(/due date/i);
    await user.clear(dueDateInput);
    await user.type(dueDateInput, '2020-01-01T09:00');

    await user.click(screen.getByRole('button', {name: /create task/i}));

    expect(await screen.findByText(/must be in the future/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
