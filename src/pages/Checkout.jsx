import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { ALL_EVENTS, THIS_WEEK, formatEventDate } from './Homepage.jsx';
import './Checkout.css';

const ALL = [...THIS_WEEK, ...ALL_EVENTS];

const HOLD_MINUTES = 10;

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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

function formatMoney(n) {
  return `₦${n.toLocaleString('en-NG')}`;
}

function parseMoney(price) {
  return Number(String(price).replace(/[^\d]/g, '')) || 0;
}

function useCountdown(seconds) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return { remaining, formatted: `${mm}:${ss}` };
}

function Field({ label, name, type = 'text', value, onChange, error, autoComplete, placeholder, required }) {
  const id = `field-${name}`;
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required && <span className="field-required">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p id={`${id}-error`} className="field-message">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();

  const event =
    location.state?.event ??
    ALL.find((e) => String(e.id) === String(id));

  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { remaining, formatted } = useCountdown(HOLD_MINUTES * 60);
  const expired = remaining === 0;

  const unitPrice = useMemo(() => (event ? parseMoney(event.price) : 0), [event]);
  const subtotal = unitPrice * quantity;
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expired) return;
    if (!validate()) {
      const firstError = document.querySelector('.field-error input');
      firstError?.focus();
      return;
    }
    setSubmitting(true);
    // TODO: replace with real payment / order creation
    setTimeout(() => {
      setSubmitting(false);
      console.log('Order placed', { event, quantity, form, total });
    }, 900);
  };

  // Event not found
  if (!event) {
    return (
      <div className="page">
        <Header />
        <section className="not-found">
          <h1>Event not found</h1>
          <p>We couldn't find that event. It may have ended or the link is broken.</p>
          <Link to="/events" className="btn btn-primary">Browse all events</Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      {/* Hold countdown banner */}
      <div className={`hold-banner ${expired ? 'is-expired' : ''}`} role="status" aria-live="polite">
        <div className="hold-banner-inner">
          <ClockIcon />
          {expired ? (
            <span>
              <strong>Your hold expired.</strong> Tickets may no longer be available —{' '}
              <Link to={`/events/${event.id}`}>start again</Link>.
            </span>
          ) : (
            <span>
              Tickets held for you — <strong>{formatted}</strong> left to complete your order.
            </span>
          )}
        </div>
      </div>

      <div className="checkout">
        <Link to={`/events/${event.id}`} className="back-link">
          <ArrowLeft /> Back to event
        </Link>

        <header className="checkout-header">
          <h1>Checkout</h1>
          <p>You're one step away from {event.title}.</p>
        </header>

        <div className="checkout-layout">

          {/* ---------- Form ---------- */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <section className="checkout-block">
              <div className="checkout-block-head">
                <h2>Your details</h2>
                <p>Tickets will be sent to this email.</p>
              </div>

              <div className="field-grid">
                <Field
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  autoComplete="given-name"
                  placeholder="Ada"
                  required
                />
                <Field
                  label="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  autoComplete="family-name"
                  placeholder="Okafor"
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                  placeholder="ada@example.com"
                  required
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  autoComplete="tel"
                  placeholder="+234 801 234 5678"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="field-notes">Notes for the organizer <span className="field-optional">(optional)</span></label>
                <textarea
                  id="field-notes"
                  name="notes"
                  rows="3"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Accessibility needs, dietary notes, questions…"
                />
              </div>
            </section>

            <section className="checkout-block">
              <div className="checkout-block-head">
                <h2>Payment</h2>
                <p>You won't be charged until you confirm.</p>
              </div>

              <div className="payment-placeholder">
                <span>Card payment</span>
                <span className="payment-placeholder-note">Paystack / Flutterwave integration goes here</span>
              </div>
            </section>

            <label className="checkout-terms">
              <input type="checkbox" required />
              <span>I agree to the <a href="/terms">terms</a> and <a href="/privacy">privacy policy</a>.</span>
            </label>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={expired || submitting}
            >
              {expired ? 'Hold expired' : submitting ? 'Processing…' : `Pay ${formatMoney(total)}`}
            </button>
          </form>

          {/* ---------- Summary ---------- */}
          <aside className="checkout-summary" aria-label="Order summary">
            <div className="summary-card">
              <div className="summary-event">
                <div className="summary-stub" aria-hidden="true">
                  <span className="summary-stub-month">{event.month}</span>
                  <span className="summary-stub-day">{event.day}</span>
                </div>
                <div className="summary-event-body">
                  <h3>{event.title}</h3>
                  <ul className="summary-meta">
                    <li><CalendarIcon /> {formatEventDate(event)}</li>
                    <li><ClockIcon /> {event.doors} – {event.end}</li>
                    <li><PinIcon /> {event.venue}</li>
                  </ul>
                </div>
              </div>

              <div className="summary-qty">
                <span>Quantity</span>
                <div className="qty-control" role="group" aria-label="Ticket quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>

              <dl className="summary-lines">
                <div>
                  <dt>{formatMoney(unitPrice)} × {quantity}</dt>
                  <dd>{formatMoney(subtotal)}</dd>
                </div>
                <div>
                  <dt>Service fee</dt>
                  <dd>{formatMoney(fee)}</dd>
                </div>
              </dl>

              <div className="summary-total">
                <span>Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>

              <p className="summary-note">
                Free cancellation up to 24 hours before the event.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}