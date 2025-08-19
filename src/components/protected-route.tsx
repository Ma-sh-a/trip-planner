import { useAuth } from '../contexts/auth-context';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();

  return currentUser ? <>{children}</> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
