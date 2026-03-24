import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/crop', label: 'Advisor' },
  { to: '/weather', label: 'Weather' },
  { to: '/disease', label: 'Disease' },
  { to: '/chatbot', label: 'AI Chat' },
  { to: '/pest-alerts', label: 'Alerts' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-font { font-family: 'DM Sans', sans-serif; }
        .nav-brand-font { font-family: 'Lora', Georgia, serif; }
        .btn-scan-nav {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 4px 14px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
        }
        .btn-scan-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(61,139,55,0.45);
        }
        .nav-link-item {
          position: relative;
          transition: color 0.25s ease;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #3d8b37;
          border-radius: 99px;
          transform: translateX(-50%);
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link-item.active::after,
        .nav-link-item:hover::after { width: 100%; }
        .nav-link-item.active { color: #3d8b37 !important; font-weight: 600; }
        .mobile-menu-enter {
          animation: slideDown 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Floating Pill Nav ── */}
      <nav
        className={`nav-font fixed left-1/2 z-50 flex items-center justify-between
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${scrolled
            ? 'top-3 -translate-x-1/2 w-[96%] max-w-5xl px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg shadow-black/8 border border-stone-200/80'
            : 'top-5 -translate-x-1/2 w-[90%] max-w-6xl px-6 py-3.5 rounded-3xl bg-white/80 backdrop-blur-lg shadow-md shadow-black/5 border border-stone-100'
          }`}
      >
        {/* Brand */}
        <Link
          to="/"
          className="nav-brand-font flex items-center gap-2 no-underline flex-shrink-0"
        >
          <div className={`flex items-center justify-center rounded-xl bg-[#3d8b37] text-white font-bold shadow-sm transition-all duration-500 ${scrolled ? 'w-7 h-7 text-sm' : 'w-8 h-8 text-sm'}`}>
            A
          </div>
          <span className={`font-bold text-stone-900 tracking-tight transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'}`}>
            AgriZone
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-link-item block px-3.5 py-1.5 text-sm font-medium no-underline rounded-lg transition-colors
                  ${isActive ? 'active text-[#3d8b37]' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/contact"
            className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors no-underline px-2"
          >
            Help
          </Link>
          <Link
            to="/disease"
            className="btn-scan-nav text-white text-sm font-semibold px-5 py-2.5 rounded-xl no-underline flex items-center gap-1.5"
          >
            <span className="text-base leading-none">🔬</span>
            Scan Plant
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col items-center justify-center w-9 h-9 gap-[5px] rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors border-0 cursor-pointer"
        >
          <span className={`block w-4.5 h-0.5 bg-stone-700 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} style={{ width: '18px' }} />
          <span className={`block h-0.5 bg-stone-700 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-[14px]'}`} />
          <span className={`block w-4.5 h-0.5 bg-stone-700 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} style={{ width: '18px' }} />
        </button>
      </nav>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className={`mobile-menu-enter md:hidden fixed z-40 left-1/2 -translate-x-1/2 w-[90%] max-w-sm
            bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/12 border border-stone-100
            overflow-hidden transition-all duration-500 ${scrolled ? 'top-[60px]' : 'top-[76px]'}`}
        >
          <div className="p-3">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors mb-0.5
                  ${isActive
                    ? 'bg-[#3d8b37]/10 text-[#3d8b37] font-semibold'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#3d8b37] flex-shrink-0" />}
                    {!isActive && <span className="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0" />}
                    {label}
                  </>
                )}
              </NavLink>
            ))}

            {/* Mobile CTA */}
            <div className="pt-2 mt-1 border-t border-stone-100 flex flex-col gap-2">
              <Link
                to="/disease"
                onClick={() => setMenuOpen(false)}
                className="btn-scan-nav text-white text-sm font-semibold py-3 rounded-xl no-underline flex items-center justify-center gap-2"
              >
                <span>🔬</span> Scan a Plant — Free
              </Link>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-medium text-stone-400 hover:text-stone-600 no-underline py-2 transition-colors"
              >
                Need help? Contact support →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}