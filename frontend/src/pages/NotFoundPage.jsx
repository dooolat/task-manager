import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';

export const NotFoundPage = () => (
  <div className="full-screen-center">
    <Card className="not-found-card">
      <h1>Page not found</h1>
      <p>The page you requested does not exist in this workspace.</p>
      <Button as={Link} to="/dashboard">
        Return to dashboard
      </Button>
    </Card>
  </div>
);

