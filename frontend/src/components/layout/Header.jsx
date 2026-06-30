import { Button } from '../common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { getInitials } from '../../utils/formatters.js';

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__identity">
        <div className="avatar">{getInitials(user?.name || 'User')}</div>
        <div>
          <p className="header__eyebrow">Signed in as</p>
          <strong>{user?.name || 'Account'}</strong>
        </div>
      </div>

      <div className="header__actions">
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
        <Button variant="danger" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

