import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const RoleRedirector = () => {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role === 'etudiant') return <Navigate to="/dashboard-etudiant" replace />;
  if (role === 'enseignant') return <Navigate to="/dashboard-enseignant" replace />;
  if (role === 'entreprise') return <Navigate to="/dashboard-entreprise" replace />;
  return <Navigate to="/profil" replace />;
};

export default RoleRedirector;
