import { useEffect, useRef } from 'react';
import './AttendeeDrawer.css';

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10h10a5 5 0 0 1 0 10H9" />
      <path d="M3 10l4-4M3 10l4 4" />
    </svg>
  );
}

function RefundIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M17 8a4 4 0 0 0-4-3H10a4 4 0 0 0 0 8h4a4 4 0 0 1 0 8h-3a4 4 0 0 1-4-3" />
    </svg>
  );
}

function formatMoney(n) {
  return `₦${Number(n || 0).toLocaleString('en-NG')}`;
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('en-NG', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function AttendeeDrawer({
  attendee,
  tier,
  orderRef,
  onClose,
  onToggleCheckIn,
  onResend,
  onRefund,
}) {
  const open = Boolean(attendee);
  const drawerRef = useRef(null);
  const closeRef = useRef(null);

  // Lock body scroll while open
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
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Move focus into drawer on open
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const price = tier?.price ?? 0;

  return (
    <>
      <div
        className="drawer2-backdrop is-open"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        className="drawer2 is-open"
        role="dialog"
        aria-modal="true"
        aria-label={`Attendee details for ${attendee.name}`}
      >
        {/* ---------- Header ---------- */}
        <header className="drawer2-head">
          <div className="drawer2-head-copy">
            <span className="drawer2-eyebrow">Attendee</span>
            <h2>{attendee.name}</h2>
            <p className="drawer2-sub">
              <span className={`drawer2-status ${attendee.checkedIn ? 'is-in' : ''}`}>
                {attendee.checkedIn ? <><CheckIcon /> Checked in</> : 'Not checked in'}
              </span>
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="drawer2-close"
            aria-label="Close attendee details"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        {/* ---------- Body ---------- */}
        <div className="drawer2-body">

          {/* Contact */}
          <section className="drawer2-section">
            <h3>Contact</h3>
            <ul className="drawer2-list">
              <li>
                <span className="drawer2-list-label">Email</span>
                <span className="drawer2-list-value">
                  <a href={`mailto:${attendee.email}`}>{attendee.email}</a>
                  <button
                    type="button"
                    className="drawer2-icon-btn"
                    onClick={() => navigator.clipboard?.writeText(attendee.email)}
                    aria-label="Copy email"
                  >
                    <CopyIcon />
                  </button>
                </span>
              </li>
              <li>
                <span className="drawer2-list-label">Phone</span>
                <span className="drawer2-list-value">
                  <a href={`tel:${attendee.phone.replace(/\s+/g, '')}`}>{attendee.phone}</a>
                  <button
                    type="button"
                    className="drawer2-icon-btn"
                    onClick={() => navigator.clipboard?.writeText(attendee.phone)}
                    aria-label="Copy phone"
                  >
                    <CopyIcon />
                  </button>
                </span>
              </li>
            </ul>
          </section>

          {/* Ticket */}
          <section className="drawer2-section">
            <h3>Ticket</h3>
            <ul className="drawer2-list">
              <li>
                <span className="drawer2-list-label">Tier</span>
                <span className="drawer2-list-value">
                  <span className="drawer2-tier">{attendee.tier}</span>
                </span>
              </li>
              <li>
                <span className="drawer2-list-label">Price paid</span>
                <span className="drawer2-list-value">{formatMoney(price)}</span>
              </li>
              <li>
                <span className="drawer2-list-label">Purchased</span>
                <span className="drawer2-list-value">{formatDateTime(attendee.purchasedAt)}</span>
              </li>
              <li>
                <span className="drawer2-list-label">Order ref</span>
                <span className="drawer2-list-value">
                  <code>{orderRef}</code>
                </span>
              </li>
            </ul>
          </section>

          {/* Check-in */}
          <section className="drawer2-section">
            <h3>Check-in</h3>
            <div className={`drawer2-checkin ${attendee.checkedIn ? 'is-in' : ''}`}>
              <div className="drawer2-checkin-state">
                {attendee.checkedIn ? (
                  <>
                    <span className="drawer2-checkin-icon is-in"><CheckIcon /></span>
                    <div>
                      <strong>Checked in</strong>
                      <p>Attendee is inside the venue.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="drawer2-checkin-icon">?</span>
                    <div>
                      <strong>Not checked in</strong>
                      <p>Mark them as arrived when they show up.</p>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                className={`btn ${attendee.checkedIn ? 'btn-ghost' : 'btn-primary'} btn-block`}
                onClick={() => onToggleCheckIn(attendee.id)}
              >
                {attendee.checkedIn ? <><UndoIcon /> Undo check-in</> : <><CheckIcon /> Check in</>}
              </button>
            </div>
          </section>

          {/* Danger zone */}
          <section className="drawer2-section">
            <h3>Actions</h3>
            <div className="drawer2-actions">
              <button
                type="button"
                className="drawer2-action"
                onClick={() => onResend(attendee)}
              >
                <MailIcon />
                <div>
                  <strong>Resend ticket</strong>
                  <span>Email the QR code again</span>
                </div>
              </button>

              <button
                type="button"
                className="drawer2-action drawer2-action-danger"
                onClick={() => onRefund(attendee)}
              >
                <RefundIcon />
                <div>
                  <strong>Refund ticket</strong>
                  <span>Cancel and return {formatMoney(price)}</span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* ---------- Footer ---------- */}
        <footer className="drawer2-foot">
          <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
            Close
          </button>
        </footer>
      </aside>
    </>
  );
}