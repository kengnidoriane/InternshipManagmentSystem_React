import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adapter le chemin si besoin

const navLinks = [
  { to: '/enseignant/entreprises', label: 'Entreprises' },
  { to: '/enseignant/offres', label: 'Offres' },
  { to: '/enseignant/conversations', label: 'Conversations' },
  { to: '/enseignant/parametres', label: 'Paramètres' },
];

export default function TeacherHeader() {
  const location = useLocation();

  const linkClass =
    'relative text-lg font-light font-[var(--font-family-poiret)] tracking-wider px-1 pb-1 transition-colors duration-200';

  return (
    <header className="w-full flex items-end justify-center gap-8 px-8 pt-3 bg-transparent select-none">
      {/* Liens de gauche */}
      <nav className="flex gap-8 items-center">
        {navLinks.slice(0, 2).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              linkClass +
              (isActive
                ? ' text-[var(--color-jaune)] border-b-2 border-[var(--color-jaune)]'
                : ' text-[var(--color-light)] hover:text-[var(--color-jaune)]')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      {/* Logo central */}
      <div className="mx-10 flex-shrink-0 flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
      </div>
      {/* Liens de droite */}
      <nav className="flex gap-8 items-center">
        {navLinks.slice(2).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              linkClass +
              (isActive
                ? ' text-[var(--color-jaune)] border-b-2 border-[var(--color-jaune)]'
                : ' text-[var(--color-light)] hover:text-[var(--color-jaune)]')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
