import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { Card } from '../common/Card.jsx';
import { EmptyState } from '../common/EmptyState.jsx';
import { formatDate, formatPriorityLabel, formatStatusLabel } from '../../utils/formatters.js';

const getStatusTone = (status) => {
  if (status === 'completed') return 'success';
  if (status === 'in-progress') return 'info';
  return 'warning';
};

const getPriorityTone = (priority) => {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'neutral';
};

export const TaskList = ({ tasks, onEdit, onDelete, loading }) => {
  if (!loading && tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create your first task or refine the search and filters."
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <Card key={task.id} className="task-card">
          <div className="task-card__top">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description || 'No description added yet.'}</p>
            </div>
            <div className="task-card__badges">
              <Badge variant="status" tone={getStatusTone(task.status)}>
                {formatStatusLabel(task.status)}
              </Badge>
              <Badge variant="priority" tone={getPriorityTone(task.priority)}>
                {formatPriorityLabel(task.priority)}
              </Badge>
            </div>
          </div>

          <div className="task-card__meta">
            <span>Due: {formatDate(task.dueDate)}</span>
            <span>Category: {task.categoryId?.name || 'Uncategorized'}</span>
          </div>

          <div className="task-card__actions">
            <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

