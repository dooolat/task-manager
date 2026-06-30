import { Card } from '../common/Card.jsx';

export const StatsGrid = ({ stats }) => {
  const cards = [
    { label: 'Total tasks', value: stats.total, tone: 'primary' },
    { label: 'Completed tasks', value: stats.completed, tone: 'success' },
    { label: 'Pending tasks', value: stats.pending, tone: 'warning' },
    { label: 'High priority tasks', value: stats.highPriority, tone: 'danger' }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <Card key={card.label} className={`stat-card stat-card--${card.tone}`}>
          <p>{card.label}</p>
          <strong>{card.value}</strong>
        </Card>
      ))}
    </div>
  );
};

