import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // useAuth utilise désormais zustand

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Ex: ['etudiant', 'enseignant']
  redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const { token, role } = useAuth();

  if (!token) {
    // Pas connecté
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    // Connecté mais pas le bon rôle
    return <Navigate to="/" replace />;
  }

  // Autorisé
  return <Outlet />;
} 