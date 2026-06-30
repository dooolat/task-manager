import { useEffect, useMemo, useState } from 'react';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Textarea } from '../common/Textarea.jsx';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../../constants/task.js';

const emptyTask = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  categoryId: ''
};

const toInputDate = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
};

export const TaskForm = ({
  categories,
  initialTask,
  submitting,
  onSubmit,
  onCancel
}) => {
  const [formState, setFormState] = useState(emptyTask);
  const isEditing = Boolean(initialTask?.id);

  const categoryOptions = useMemo(
    () => [{ value: '', label: 'No category' }, ...categories.map((category) => ({ value: category.id, label: category.name }))],
    [categories]
  );

  useEffect(() => {
    if (initialTask) {
      setFormState({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || 'pending',
        priority: initialTask.priority || 'medium',
        dueDate: toInputDate(initialTask.dueDate),
        categoryId: initialTask.categoryId?.id || initialTask.categoryId || ''
      });
      return;
    }

    setFormState(emptyTask);
  }, [initialTask]);

  const handleChange = (field) => (event) => {
    setFormState((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formState,
      categoryId: formState.categoryId || null,
      dueDate: formState.dueDate || null
    });
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-card__header">
        <div>
          <h2>{isEditing ? 'Edit task' : 'Create task'}</h2>
          <p>Keep your workload structured and visible.</p>
        </div>
        {isEditing ? (
          <Button variant="secondary" size="sm" onClick={onCancel} type="button">
            Cancel edit
          </Button>
        ) : null}
      </div>

      <div className="form-grid">
        <Input
          label="Title"
          value={formState.title}
          onChange={handleChange('title')}
          placeholder="Write the task title"
          required
        />
        <Select label="Status" value={formState.status} onChange={handleChange('status')}>
          {TASK_STATUS_OPTIONS.filter((option) => option.value).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select label="Priority" value={formState.priority} onChange={handleChange('priority')}>
          {TASK_PRIORITY_OPTIONS.filter((option) => option.value).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          label="Due date"
          type="date"
          value={formState.dueDate}
          onChange={handleChange('dueDate')}
        />
        <Select label="Category" value={formState.categoryId} onChange={handleChange('categoryId')}>
          {categoryOptions.map((option) => (
            <option key={option.value || 'none'} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Description"
        value={formState.description}
        onChange={handleChange('description')}
        placeholder="Add details, context, or acceptance notes"
        rows={5}
      />

      <div className="form-card__actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEditing ? 'Update task' : 'Create task'}
        </Button>
      </div>
    </form>
  );
};

