import { Card } from '../components/common/Card.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { formatDateTime, getInitials } from '../utils/formatters.js';
import { Button } from '../components/common/Button.jsx';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Profile</p>
          <h1>Your account details.</h1>
          <p>Review the information attached to your secure task manager account.</p>
        </div>
      </section>

      <Card className="profile-card">
        <div className="profile-card__avatar">{getInitials(user?.name || 'User')}</div>
        <div className="profile-card__content">
          <h2>{user?.name || 'Account'}</h2>
          <p>{user?.email || 'Not available'}</p>
          <dl className="profile-list">
            <div>
              <dt>Account created</dt>
              <dd>{formatDateTime(user?.createdAt)}</dd>
            </div>
            <div>
              <dt>Account updated</dt>
              <dd>{formatDateTime(user?.updatedAt)}</dd>
            </div>
          </dl>

        </div>

        <div className="profile-card__footer">
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};
