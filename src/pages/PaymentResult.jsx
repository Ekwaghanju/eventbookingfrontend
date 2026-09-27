import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { ALL_EVENTS, THIS_WEEK, formatEventDate } from './Homepage.jsx';
import './PaymentResult.css';

const ALL = [...THIS_WEEK, ...ALL_EVENTS];

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function ClockIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function formatMoney(n) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

// Generates a short, readable order reference like "AO-4K7Q2Z"
function makeOrderRef() {
  return `AO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const COPY = {
  success: {
    tone: 'success',
    icon: <CheckIcon />,
    title: 'Payment successful',
    lede: "You're going! Your tickets are below — a copy has been emailed to you.",
  },
  pending: {
    tone: 'pending',
    icon: <ClockIcon />,
    title: 'Payment pending',
    lede: "We're waiting on your bank to confirm the payment. This usually takes a few minutes.",
  },
  failed: {
    tone: 'failed',
    icon: <XIcon />,
    title: 'Payment failed',
    lede: "Your card was not charged. You can try again or use a different payment method.",
  },
};

export default function PaymentResult() {
  const { id } = useParams();
  const location = useLocation();

  // status comes from ?status=success|pending|failed — defaults to success
  const params = new URLSearchParams(location.search);
  const status = ['success', 'pending', 'failed'].includes(params.get('status'))
    ? params.get('status')
    : 'success';

  const copy = COPY[status];

  const event =
    location.state?.event ??
    ALL.find((e) => String(e.id) === String(id));

  // Stable order ref for the life of this render
  const orderRef = useMemo(() => makeOrderRef(), []);
  const quantity = location.state?.quantity ?? 1;

  // Derive totals from event price if we have it
  const unitPrice = event ? Number(String(event.price).replace(/[^\d]/g, '')) || 0 : 0;
  const subtotal = unitPrice * quantity;
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [status, id]);

  return (
    <div className="page">
      <Header />

      <main className={`result result-${copy.tone}`}>
        <div className="result-inner">

          {/* ---------- Status hero ---------- */}
          <div className="result-hero">
            <div className="result-icon" aria-hidden="true">{copy.icon}</div>
            <h1>{copy.title}</h1>
            <p className="result-lede">{copy.lede}</p>
            <p className="result-ref">
              Order reference <strong>{orderRef}</strong>
            </p>
          </div>

          {/* ---------- Failure actions ---------- */}
          {status === 'failed' && event && (
            <div className="result-actions-inline">
              <Link to={`/checkout/${event.id}`} state={{ event }} className="btn btn-primary">
                Try again
              </Link>
              <Link to={`/events/${event.id}`} className="btn btn-ghost">
                Back to event
              </Link>
            </div>
          )}

          {/* ---------- Order details ---------- */}
          {event && (
            <section className="result-card" aria-label="Order details">
              <header className="result-card-head">
                <h2>{status === 'failed' ? 'Order summary' : 'Your tickets'}</h2>
                {status !== 'failed' && (
                  <span className="result-pill">
                    {quantity} {quantity === 1 ? 'ticket' : 'tickets'}
                  </span>
                )}
              </header>

              {/* Ticket stub block */}
              <div className="ticket-stub">
                <div className="ticket-stub-left">
                  <span className="ticket-stub-month">{event.month}</span>
                  <span className="ticket-stub-day">{event.day}</span>
                </div>

                <div className="ticket-stub-divider" aria-hidden="true" />

                <div className="ticket-stub-body">
                  <h3>{event.title}</h3>
                  <ul className="ticket-meta">
                    <li><CalendarIcon /> {formatEventDate(event)}</li>
                    <li><ClockIcon size={14} /> Doors {event.doors} · Starts {event.start}</li>
                    <li><PinIcon /> {event.venue}</li>
                  </ul>
                </div>
              </div>

              {/* Line items */}
              <dl className="result-lines">
                <div>
                  <dt>{formatMoney(unitPrice)} × {quantity}</dt>
                  <dd>{formatMoney(subtotal)}</dd>
                </div>
                <div>
                  <dt>Service fee</dt>
                  <dd>{formatMoney(fee)}</dd>
                </div>
                <div className="result-total">
                  <dt>{status === 'failed' ? 'Total due' : 'Total paid'}</dt>
                  <dd><strong>{formatMoney(total)}</strong></dd>
                </div>
              </dl>
            </section>
          )}

          {/* ---------- Info blocks ---------- */}
          {status === 'success' && (
            <section className="result-info">
              <h3>What happens next</h3>
              <ul>
                <li>We've emailed your tickets to the address you provided.</li>
                <li>Show the QR code at the door — no need to print.</li>
                <li>You can transfer tickets to a friend up to 24 hours before the event.</li>
              </ul>
            </section>
          )}

          {status === 'pending' && (
            <section className="result-info result-info-pending">
              <h3>While you wait</h3>
              <ul>
                <li>Do not close this tab — we'll update it as soon as the bank responds.</li>
                <li>You'll receive an email as soon as the payment clears.</li>
                <li>If nothing happens within 30 minutes, contact support with the order reference above.</li>
              </ul>
            </section>
          )}

          {status === 'failed' && (
            <section className="result-info result-info-failed">
              <h3>Common reasons</h3>
              <ul>
                <li>Insufficient funds or a daily limit reached.</li>
                <li>The card was declined by your bank.</li>
                <li>Incorrect card details or expiry date.</li>
              </ul>
            </section>
          )}

          {/* ---------- Primary actions ---------- */}
          <div className="result-actions">
            {status === 'success' && (
              <>
                <Link to="/orders" className="btn btn-primary">View my tickets</Link>
                <Link to="/events" className="btn btn-ghost">Browse more events</Link>
              </>
            )}

            {status === 'pending' && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh status
                </button>
                <Link to="/orders" className="btn btn-ghost">View my tickets</Link>
              </>
            )}

            {status === 'failed' && (
              <Link to="/events" className="btn btn-ghost">Browse more events</Link>
            )}
          </div>

          <p className="result-footnote">
            Need help? <a href="mailto:etheodore9@gmail.com">etheodore9@gmail.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}