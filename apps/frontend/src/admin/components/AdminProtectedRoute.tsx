import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    // Redirect to signin if not authenticated
    return <Navigate to="/admin/signin" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute; 