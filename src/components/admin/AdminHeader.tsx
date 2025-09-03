import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import NotificationBell from '../NotificationBell';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/enterprises', label: 'Entreprises' },
  { to: '/admin/teachers', label: 'Enseignants' },
  { to: '/admin/students', label: 'Étudiants' },
  { to: '/admin/settings', label: 'Paramètres' },
];

export default function AdminHeader() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const linkClass =
    'relative text-lg font-light font-[var(--font-family-poiret)] tracking-wider px-1 pb-1 transition-colors duration-200';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full flex items-end justify-center mb-7 gap-8 px-8 pt-3 bg-transparent select-none">
      {/* Liens de gauche */}
      <nav className="flex gap-8 items-center">
        {navLinks.slice(0, 3).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              linkClass +
              (isActive
                ? ' text-[var(--color-emeraude)] border-b-2 border-[var(--color-emeraude)]'
                : ' text-[var(--color-light)] hover:text-[var(--color-emeraude)]')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      {/* Logo central */}
      <NavLink to="/">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </NavLink>
      {/* Liens de droite */}
      <nav className="flex gap-8 items-center">
        {navLinks.slice(3).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              linkClass +
              (isActive
                ? ' text-[var(--color-jaune)] border-b-2 border-[var(--color-jaune)]'
                : ' text-[var(--color-light)] hover:text-[var(--color-emeraude)]')
            }
          >
            {link.label}
          </NavLink>
        ))}
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
        >
          Déconnexion
        </button>
      </nav>
    </header>
  );
}