import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/crop',        label: 'Crop Advisor' },
  { to: '/weather',     label: 'Weather' },
  { to: '/disease',     label: 'Disease Detection' },
  { to: '/chatbot',     label: 'AI Assistant' },
  { to: '/pest-alerts', label: 'Pest Alerts' },
  { to: '/about',       label: 'About' },
  { to: '/contact',     label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <span className="nav-brand-icon">🌱</span>
          <span>Agrizone</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
