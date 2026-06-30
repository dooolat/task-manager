import { Card } from './Card.jsx';

export const EmptyState = ({ title, description, action }) => (
  <Card className="empty-state">
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </Card>
);

