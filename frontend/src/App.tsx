import {useState} from 'react';
import {TaskForm} from './components/TaskForm';
import type {Task} from './types';

function App() {
  const [recentTask, setRecentTask] = useState<Task | null>(null);

  return (
    <div className="card">
      <h1>HMCTS Task Creator</h1>
      <p>
        Capture tasks for caseworkers to manage their upcoming workload. Provide a concise title,
        optional context, current status, and when the task needs action.
      </p>

      {recentTask && (
        <div className="success-banner" role="status">
          <strong>Task created:</strong> {recentTask.title}
        </div>
      )}

      <TaskForm onTaskCreated={setRecentTask} />

      {recentTask && (
        <article className="task-details" aria-live="polite">
          <h2>Latest task details</h2>
          <p>
            <strong>Status:</strong> {recentTask.status.replace(/_/g, ' ')}
          </p>
          <p>
            <strong>Due:</strong> {new Date(recentTask.dueDateTime).toLocaleString()}
          </p>
          {recentTask.description && (
            <p>
              <strong>Description:</strong> {recentTask.description}
            </p>
          )}
        </article>
      )}
    </div>
  );
}

export default App;
