import { NavLink } from 'react-router-dom';
import { AppLogo } from '../common/AppLogo.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/categories', label: 'Categories' },
  { to: '/profile', label: 'Profile' }
];

export const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar__brand">
      <AppLogo />
      <div>
        <strong>Task Manager</strong>
        <p>Military practice project</p>
      </div>
    </div>

    <nav className="sidebar__nav" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`.trim()}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
