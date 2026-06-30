import { useEffect, useState } from 'react';
import { Card } from '../components/common/Card.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { TaskForm } from '../components/forms/TaskForm.jsx';
import { TaskFilters } from '../components/tasks/TaskFilters.jsx';
import { TaskList } from '../components/tasks/TaskList.jsx';
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  updateTaskRequest
} from '../services/taskService.js';
import { getCategoriesRequest } from '../services/categoryService.js';
import { readStoredValue, writeStoredValue } from '../utils/storage.js';
import { getErrorMessage } from '../utils/errors.js';
import { useNotifications } from '../hooks/useNotifications.js';

const savedFilters = readStoredValue('task-manager-filters', {
  search: '',
  status: '',
  priority: '',
  page: 1,
  limit: 10
});

export const TasksPage = () => {
  const { success, error } = useNotifications();
  const [filters, setFilters] = useState(savedFilters);
  const [searchDraft, setSearchDraft] = useState(savedFilters.search || '');
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((current) =>
        current.search === searchDraft
          ? current
          : {
              ...current,
              search: searchDraft,
              page: 1
            }
      );
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchDraft]);

  useEffect(() => {
    writeStoredValue('task-manager-filters', filters);
  }, [filters]);

  const loadTasks = async () => {
    setLoading(true);
    setPageError('');

    try {
      const [taskResponse, categoryData] = await Promise.all([
        getTasksRequest(filters),
        getCategoriesRequest()
      ]);

      setTasks(taskResponse.data || []);
      setPagination(taskResponse.meta || null);
      setCategories(categoryData || []);
    } catch (err) {
      const message = getErrorMessage(err);
      setPageError(message);
      error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks().catch(() => {});
  }, [filters]);

  const handleFilterChange = (field, value) => {
    if (field === 'search') {
      setSearchDraft(value);
      return;
    }

    setFilters((current) => ({
      ...current,
      [field]: value,
      page: 1
    }));
  };

  const handleReset = () => {
    const resetFilters = { search: '', status: '', priority: '', page: 1, limit: 10 };
    setSearchDraft('');
    setFilters(resetFilters);
  };

  const handleTaskSubmit = async (payload) => {
    setSaving(true);

    try {
      if (selectedTask) {
        await updateTaskRequest(selectedTask.id, payload);
        success('Task updated successfully.');
      } else {
        await createTaskRequest(payload);
        success('Task created successfully.');
      }

      setSelectedTask(null);
      await loadTasks();
    } catch (err) {
      const message = getErrorMessage(err);
      error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;

    try {
      await deleteTaskRequest(task.id);
      success('Task deleted.');
      await loadTasks();
      if (selectedTask?.id === task.id) {
        setSelectedTask(null);
      }
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Tasks</p>
          <h1>Manage every task from one place.</h1>
          <p>Search, filter, update, and delete tasks while keeping your progress visible.</p>
        </div>
      </section>

      {pageError ? <div className="form-message form-message--error">{pageError}</div> : null}

      <TaskForm
        categories={categories}
        initialTask={selectedTask}
        submitting={saving}
        onSubmit={handleTaskSubmit}
        onCancel={() => setSelectedTask(null)}
      />

      <TaskFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {loading ? (
        <div className="page-loader">
          <Spinner label="Loading tasks" />
        </div>
      ) : (
        <>
          <Card className="section-card">
            <div className="section-card__header">
              <h2>Task list</h2>
              <span>
                {pagination ? `${pagination.total} task${pagination.total === 1 ? '' : 's'}` : '0 tasks'}
              </span>
            </div>

            <TaskList
              tasks={tasks}
              onEdit={setSelectedTask}
              onDelete={handleDelete}
              loading={loading}
            />
          </Card>

          <Pagination meta={pagination} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
        </>
      )}
    </div>
  );
};
