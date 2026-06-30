import { AppLogo } from '../common/AppLogo.jsx';

export const AuthShell = ({ title, subtitle, children }) => (
  <div className="auth-shell">
    <section className="auth-shell__panel">
      <div className="auth-shell__brand">
        <AppLogo />
        <div>
          <strong>Task Manager</strong>
          <p>Organize work, deadlines, and categories in one calm workspace.</p>
        </div>
      </div>

      <div className="auth-shell__copy">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>

    <section className="auth-shell__form">
      <div className="card auth-card">{children}</div>
    </section>
  </div>
);
