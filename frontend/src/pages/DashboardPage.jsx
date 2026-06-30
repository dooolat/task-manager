import { useEffect, useState } from 'react';
import { Card } from '../components/common/Card.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { StatsGrid } from '../components/dashboard/StatsGrid.jsx';
import { getTaskSummaryRequest, getTasksRequest } from '../services/taskService.js';
import { getCategoriesRequest } from '../services/categoryService.js';
import { formatDate } from '../utils/formatters.js';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Button } from '../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { getErrorMessage } from '../utils/errors.js';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { error: notifyError } = useNotifications();
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setPageError('');

      try {
        const [summaryData, taskData, categoryData] = await Promise.all([
          getTaskSummaryRequest(),
          getTasksRequest({ page: 1, limit: 5 }),
          getCategoriesRequest()
        ]);

        setSummary(summaryData);
        setRecentTasks(taskData.data || []);
        setCategories(categoryData || []);
      } catch (err) {
        const message = getErrorMessage(err);
        setPageError(message);
        notifyError(message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard().catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner label="Loading dashboard" />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Dashboard</p>
          <h1>Good to see you, {user?.name?.split(' ')[0] || 'there'}.</h1>
          <p>
            Here is a clear snapshot of your task workload, progress, and category structure.
          </p>
        </div>
      </section>

      <StatsGrid stats={summary} />

      {pageError ? <div className="form-message form-message--error">{pageError}</div> : null}

      <div className="dashboard-grid">
        <Card className="section-card">
          <div className="section-card__header">
            <h2>Recent tasks</h2>
            <Link to="/tasks">View all</Link>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Create tasks from the Tasks page to see them appear here."
              action={
                <Button as={Link} to="/tasks">
                  Add your first task
                </Button>
              }
            />
          ) : (
            <div className="mini-list">
              {recentTasks.map((task) => (
                <div key={task.id} className="mini-list__item">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.categoryId?.name || 'Uncategorized'}</p>
                  </div>
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="section-card">
          <div className="section-card__header">
            <h2>Categories</h2>
            <Link to="/categories">Manage</Link>
          </div>

          {categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Create categories to group tasks by subject or priority."
            />
          ) : (
            <div className="chip-list">
              {categories.map((category) => (
                <span key={category.id} className="category-chip">
                  <span className="category-chip__dot" style={{ backgroundColor: category.color }} />
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
