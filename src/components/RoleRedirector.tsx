import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleRedirector = () => {
  const { token, role } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (role === 'STUDENT') return <Navigate to="/etudiant/stages" replace />;
  if (role === 'TEACHER') return <Navigate to="/enseignant/offres" replace />;
  if (role === 'ENTERPRISE') return <Navigate to="/entreprise/offres" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export default RoleRedirector;
