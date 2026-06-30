import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../common/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="full-screen-center">
        <Spinner label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

