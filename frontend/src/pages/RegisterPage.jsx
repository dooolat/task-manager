import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { getErrorMessage } from '../utils/errors.js';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { success, error } = useNotifications();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: ''
  });
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
      await register(formState);
      success('Account created successfully.');
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
      title="Create your account"
      subtitle="Set up your workspace to manage tasks, deadlines, and categories with confidence."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-card__header">
          <h2>Registration</h2>
          <p>Passwords must include at least 8 characters, uppercase, lowercase, and a number.</p>
        </div>

        {formError ? <div className="form-message form-message--error">{formError}</div> : null}

        <Input
          label="Full name"
          value={formState.name}
          onChange={handleChange('name')}
          placeholder="Your name"
          required
        />
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
          placeholder="Create a secure password"
          minLength={8}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+"
          title="Password must include uppercase, lowercase, and a number"
          helperText="Use at least 8 characters with uppercase, lowercase, and a number."
          required
        />

        <Button type="submit" className="full-width" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </Button>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
};
