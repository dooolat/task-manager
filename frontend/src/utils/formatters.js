import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '../constants/task.js';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
});

export const formatDate = (value) => {
  if (!value) {
    return 'No due date';
  }

  return dateFormatter.format(new Date(value));
};

export const formatDateTime = (value) => {
  if (!value) {
    return 'Not available';
  }

  return dateTimeFormatter.format(new Date(value));
};

export const formatStatusLabel = (status) => TASK_STATUS_LABELS[status] || 'Unknown';

export const formatPriorityLabel = (priority) => TASK_PRIORITY_LABELS[priority] || 'Unknown';

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

