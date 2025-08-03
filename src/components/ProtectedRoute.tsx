import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Ex: ['etudiant', 'enseignant']
  redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const { token, role } = useAuthStore();

  if (!token) {
    // Pas connecté
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes((role || '').toUpperCase())) {
    // Connecté mais pas le bon rôle
    return <Navigate to="/" replace />;
  }

  // Autorisé
  return <Outlet />;
} 