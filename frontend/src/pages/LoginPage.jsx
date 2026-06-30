import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { getErrorMessage } from '../utils/errors.js';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useNotifications();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (field) => (event) => {
    setFormState((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      await login(formState);
      success('Welcome back.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = getErrorMessage(err);
      setFormError(message);
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track your tasks, categories, and progress from one secure dashboard."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-card__header">
          <h2>Login</h2>
          <p>Use the email and password you registered with.</p>
        </div>

        {formError ? <div className="form-message form-message--error">{formError}</div> : null}

        <Input
          label="Email"
          type="email"
          value={formState.email}
          onChange={handleChange('email')}
          placeholder="name@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={formState.password}
          onChange={handleChange('password')}
          placeholder="Your password"
          required
        />

        <Button type="submit" className="full-width" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </Button>

        <p className="auth-card__footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
};

