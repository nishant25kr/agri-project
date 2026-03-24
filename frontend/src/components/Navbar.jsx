import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/crop',        label: 'Advisor' },
  { to: '/weather',     label: 'Weather' },
  { to: '/disease',     label: 'Disease' },
  { to: '/chatbot',     label: 'AI Chat' },
  { to: '/pest-alerts', label: 'Alerts' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav-glass" style={{ 
      top: scrolled ? '12px' : '24px',
      width: scrolled ? '95%' : '90%',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <Link to="/" className="nav-brand">
        <span style={{ fontSize: '1.8rem' }}>🌿</span>
        <span style={{ letterSpacing: '-1px' }}>AgriZone</span>
      </Link>

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
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
          Get Help
        </Link>
      </div>
    </nav>
  );
}
