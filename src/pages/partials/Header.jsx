import { useEffect, useRef, useState } from 'react';
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

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <a href="/" className="logo" aria-label="Admit One home">
            <span className="logo-mark" aria-hidden="true">EBP</span>
            <span className="logo-text">Event Booking Platform</span>
          </a>

          <nav className="site-nav" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <div className="site-header-actions">
            <a href="/organizer/login" className="nav-organizer">Organizer login</a>
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

        <nav className="drawer-nav" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="drawer-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </a>
          ))}
        </nav>

        <div className="drawer-footer">
          <a
            href="/organizer/login"
            className="drawer-cta"
            onClick={() => setOpen(false)}
          >
            Organizer login
          </a>
          <a
            href="/events"
            className="drawer-cta drawer-cta-primary"
            onClick={() => setOpen(false)}
          >
            Browse events
          </a>
        </div>
      </aside>
    </>
  );
}