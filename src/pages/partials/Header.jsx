import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import './Header.css';

const NAV_LINKS = [
  { href: '/events', label: 'Browse' },
  { href: '/orders', label: 'My tickets' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Move focus into drawer on open, back to button on close
  useEffect(() => {
    if (open) {
      const first = drawerRef.current?.querySelector(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [open]);

  const handleSignOut = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo" aria-label="Admit One home">
            <span className="logo-mark" aria-hidden="true">EBP</span>
            <span className="logo-text">Event Booking Platform</span>
          </Link>

          <nav className="site-nav" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} to={l.href}>{l.label}</Link>
            ))}
          </nav>

          <div className="site-header-actions">
            {user ? (
              <div className="nav-user">
                <span className="nav-avatar" aria-hidden="true">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
                <span className="nav-username">{user.name}</span>
                <button
                  type="button"
                  className="nav-organizer"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link-plain">Sign in</Link>
                <Link to="/organizer/login" className="nav-organizer">Organizer login</Link>
              </>
            )}

            <button
              ref={menuButtonRef}
              className="nav-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              type="button"
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        id="mobile-drawer"
        ref={drawerRef}
        className={`drawer ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button
            className="drawer-close"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Signed-in strip */}
        {user && (
          <div className="drawer-user">
            <span className="nav-avatar" aria-hidden="true">
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
            <div className="drawer-user-body">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        )}

        <nav className="drawer-nav" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="drawer-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="drawer-footer">
          {user ? (
            <button
              type="button"
              className="drawer-cta"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="drawer-cta"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          )}
          <Link
            to="/organizer/login"
            className="drawer-cta"
            onClick={() => setOpen(false)}
          >
            Organizer login
          </Link>
          <Link
            to="/events"
            className="drawer-cta drawer-cta-primary"
            onClick={() => setOpen(false)}
          >
            Browse events
          </Link>
        </div>
      </aside>
    </>
  );
}