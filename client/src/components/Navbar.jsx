import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaMoon, FaSun, FaHeart, FaUserCircle, FaBars, FaTimes, FaUtensils, FaChartLine,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition hover:text-brand-600 ${
      isActive ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
            <FaUtensils />
          </span>
          <span className="font-display text-lg font-extrabold">
            Food<span className="text-brand-500">Spot</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLink} end>
            Home
          </NavLink>
          <NavLink to="/search" className={navLink}>
            Explore
          </NavLink>
          {user && (
            <NavLink to="/favorites" className={navLink}>
              Favourites
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLink}>
              <span className="inline-flex items-center gap-1">
                <FaChartLine /> Admin
              </span>
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn-ghost h-9 w-9 !px-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/favorites" className="btn-ghost h-9 w-9 !px-0" aria-label="Favourites">
                <FaHeart className="text-brand-500" />
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-gray-100 py-1 pl-3 pr-1 dark:bg-gray-800">
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                <FaUserCircle className="text-xl text-gray-400" />
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-outline h-9">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost h-9">
                Login
              </Link>
              <Link to="/register" className="btn-primary h-9">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="btn-ghost h-9 w-9 !px-0 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" onClick={() => setOpen(false)} className={navLink} end>Home</NavLink>
            <NavLink to="/search" onClick={() => setOpen(false)} className={navLink}>Explore</NavLink>
            {user && <NavLink to="/favorites" onClick={() => setOpen(false)} className={navLink}>Favourites</NavLink>}
            {isAdmin && <NavLink to="/admin" onClick={() => setOpen(false)} className={navLink}>Admin</NavLink>}
            <hr className="border-gray-100 dark:border-gray-800" />
            {user ? (
              <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="btn-outline">
                Logout ({user.name.split(' ')[0]})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
