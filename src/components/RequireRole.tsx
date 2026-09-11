import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useBusinessData } from '../context/BusinessDataContext';
import { ROLE_PAGE_ACCESS } from '../types';

export default function RequireRole() {
  const { currentUserRole } = useBusinessData();
  const location = useLocation();

  // Owner (or role not yet loaded) always passes — full access.
  if (!currentUserRole || currentUserRole === 'owner') {
    return <Outlet />;
  }

  const allowed = ROLE_PAGE_ACCESS[currentUserRole].includes(location.pathname);
  return allowed ? <Outlet /> : <Navigate to="/app" replace />;
}