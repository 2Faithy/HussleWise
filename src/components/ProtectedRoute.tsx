import { Navigate, Outlet } from 'react-router-dom';
import { useBusinessData } from '../context/BusinessDataContext';

export default function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useBusinessData();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}