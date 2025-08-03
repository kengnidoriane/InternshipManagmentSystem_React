import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleRedirector = () => {
  const { token, role } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (role === 'ETUDIANT') return <Navigate to="/dashboard-etudiant" replace />;
  if (role === 'ENSEIGNANT') return <Navigate to="/dashboard-enseignant" replace />;
  if (role === 'ENTREPRISE') return <Navigate to="/dashboard-entreprise" replace />;
  return <Navigate to="/profil" replace />;
};

export default RoleRedirector;
