import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';
import NotificationBell from '../NotificationBell';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { to: '/entreprise/offres', label: 'Listes des offres' },
  { to: '/entreprise/candidatures', label: 'Candidatures' },
];

const rightLinks = [
  { to: '/entreprise/profil', label: 'Profil entreprise' },
  { to: '/entreprise/parametres', label: 'Paramètre' },
];

export default function EntrepriseHeader() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const linkClass =
    'relative text-lg font-light font-[var(--font-family-poiret)] tracking-wider px-1 pb-1 transition-colors duration-200';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full flex items-end justify-center mb-7  gap-8 px-8 pt-3 bg-transparent select-none">
      {/* Liens de gauche */}
      <nav className="flex gap-8 items-center">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? 'text-[var(--color-emeraude)]' : 'text-[var(--color-light)]'}`
            }
          >
            {({ isActive }) => (
              <motion.span
                className="relative inline-block pb-1"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                {link.label}
                <motion.span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-full"
                  style={{
                    width: '100%',
                    minWidth: 24,
                    height: '2px',
                    transformOrigin: 'center',
                    display: 'block',
                  }}
                  variants={{
                    rest: {
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                      backgroundColor: isActive ? 'var(--color-emeraude)' : 'var(--color-jaune)',
                    },
                    hover: {
                      scaleX: 1,
                      opacity: 1,
                      backgroundColor: 'var(--color-light)',
                    },
                  }}
                  transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                />
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logo */}
      <NavLink to="/">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </NavLink>

      {/* Liens de droite */}
      <nav className="flex gap-8 items-center">
        {rightLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? 'text-[var(--color-emeraude)]' : 'text-[var(--color-light)]'}`
            }
          >
            {({ isActive }) => (
              <motion.span
                className="relative inline-block pb-1"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                {link.label}
                <motion.span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-full"
                  style={{
                    width: '100%',
                    minWidth: 24,
                    height: '2px',
                    transformOrigin: 'center',
                    display: 'block',
                  }}
                  variants={{
                    rest: {
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                      backgroundColor: isActive ? 'var(--color-emeraude)' : 'var(--color-jaune)',
                    },
                    hover: {
                      scaleX: 1,
                      opacity: 1,
                      backgroundColor: 'var(--color-light)',
                    },
                  }}
                  transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                />
              </motion.span>
            )}
          </NavLink>
        ))}
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-200 text-sm font-medium ml-4"
        >
          Déconnexion
        </button>
      </nav>
    </header>
  );
}