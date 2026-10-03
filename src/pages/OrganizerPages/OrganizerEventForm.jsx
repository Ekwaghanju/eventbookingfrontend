import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../partials/Header.jsx';
import Footer from '../partials/Footer.jsx';
import { useOrganizerAuth } from '../../auth/OrganizerAuthContext.jsx';
import { loadEvents, saveEvents, makeId } from '../../data/OrganizerEvent.js';
import './OrganizerEventForm.css';

const CATEGORIES = ['Music', 'Tech', 'Workshops', 'Comedy', 'Networking', 'Food', 'Arts', 'Sports', 'Community'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function emptyForm() {
  return {
    title: '',
    category: 'Music',
    status: 'draft',
    year: new Date().getFullYear(),
    month: MONTHS[new Date().getMonth()],
    day: String(new Date().getDate()).padStart(2, '0'),
    doors: '18:00',
    start: '19:00',
    end: '22:00',
    venue: '',
    description: '',
    tickets: [
      { id: makeId(), name: 'General', price: 5000, quantity: 100, sold: 0 },
    ],
  };
}

function Field({ label, name, error, hint, required, children }) {
  return (
    <div className={`form-field ${error ? 'is-error' : ''}`}>
      <label htmlFor={`f-${name}`}>
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      {error ? <p className="form-msg">{error}</p> : hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}

export default function OrganizerEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizer } = useOrganizerAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(() => {
    if (isEdit) {
      const found = loadEvents().find((e) => e.id === id);
      return found ? { ...emptyForm(), ...found } : emptyForm();
    }
    return emptyForm();
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!organizer) {
    return (
      <div className="page">
        <Header />
        <section className="dash-empty">
          <h1>You're not signed in</h1>
          <p>Sign in to manage events.</p>
          <Link to="/organizer/login" className="btn btn-primary">Organizer sign in</Link>
        </section>
        <Footer />
      </div>
    );
  }

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    set({ [name]: value });
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const updateTicket = (ticketId, patch) => {
    setForm((f) => ({
      ...f,
      tickets: f.tickets.map((t) => (t.id === ticketId ? { ...t, ...patch } : t)),
    }));
  };

  const addTicket = () => {
    setForm((f) => ({
      ...f,
      tickets: [
        ...f.tickets,
        { id: makeId(), name: 'New tier', price: 0, quantity: 50, sold: 0 },
      ],
    }));
  };

  const removeTicket = (ticketId) => {
    setForm((f) => ({
      ...f,
      tickets: f.tickets.filter((t) => t.id !== ticketId),
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Give your event a title';
    if (!form.venue.trim()) next.venue = 'Where is it happening?';
    if (!form.day.trim()) next.day = 'Pick a day';
    if (!form.description.trim()) next.description = 'A short description helps people decide';

    if (form.tickets.length === 0) {
      next.tickets = 'Add at least one ticket tier';
    } else {
      form.tickets.forEach((t) => {
        if (!t.name.trim()) next.tickets = 'Every ticket needs a name';
        if (t.price < 0) next.tickets = 'Prices cannot be negative';
        if (t.quantity < 1) next.tickets = 'Quantity must be at least 1';
      });
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (targetStatus) => (e) => {
    e?.preventDefault?.();
    if (!validate()) {
      const first = document.querySelector('.form-field.is-error input, .form-field.is-error textarea');
      first?.focus();
      return;
    }

    setSaving(true);
    const all = loadEvents();
    const record = {
      ...form,
      id: isEdit ? form.id : makeId(),
      status: targetStatus ?? form.status,
      createdAt: form.createdAt ?? new Date().toISOString(),
    };

    const next = isEdit
      ? all.map((e) => (e.id === record.id ? record : e))
      : [record, ...all];

    saveEvents(next);
    setSaving(false);
    navigate('/organizer/dashboard');
  };

  const totalCapacity = useMemo(
    () => form.tickets.reduce((n, t) => n + Number(t.quantity || 0), 0),
    [form.tickets]
  );

  return (
    <div className="page">
      <Header />

      <main className="evt-form">
        <Link to="/organizer/dashboard" className="back-link">
          <ArrowLeft /> Back to dashboard
        </Link>

        <header className="evt-form-head">
          <h1>{isEdit ? 'Edit event' : 'Create an event'}</h1>
          <p>
            {isEdit
              ? 'Update details, tickets, or publish status.'
              : 'Fill in the details below. You can save as a draft and publish later.'}
          </p>
        </header>

        <div className="evt-form-layout">
          <form className="evt-form-main" onSubmit={handleSave()} noValidate>

            {/* ---------- Basics ---------- */}
            <section className="evt-block">
              <h2>Basics</h2>

              <Field label="Event title" name="title" error={errors.title} required>
                <input
                  id="f-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Rooftop Jazz Session"
                />
              </Field>

              <div className="form-row">
                <Field label="Category" name="category" required>
                  <select id="f-category" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Status" name="status">
                  <select id="f-status" name="status" value={form.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </Field>
              </div>

              <Field label="Description" name="description" error={errors.description} required>
                <textarea
                  id="f-description"
                  name="description"
                  rows="5"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What should people expect? Lineup, vibe, anything they need to know."
                />
              </Field>
            </section>

            {/* ---------- When ---------- */}
            <section className="evt-block">
              <h2>When</h2>

              <div className="form-row form-row-3">
                <Field label="Year" name="year" required>
                  <input
                    id="f-year"
                    name="year"
                    type="number"
                    min="2025"
                    max="2035"
                    value={form.year}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="Month" name="month" required>
                  <select id="f-month" name="month" value={form.month} onChange={handleChange}>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>

                <Field label="Day" name="day" error={errors.day} required>
                  <input
                    id="f-day"
                    name="day"
                    inputMode="numeric"
                    value={form.day}
                    onChange={handleChange}
                    placeholder="20"
                  />
                </Field>
              </div>

              <div className="form-row form-row-3">
                <Field label="Doors open" name="doors" hint={form.doors}>
                  <input id="f-doors" name="doors" type="time" value={form.doors} onChange={handleChange} />
                </Field>
                <Field label="Start" name="start" hint={form.start}>
                  <input id="f-start" name="start" type="time" value={form.start} onChange={handleChange} />
                </Field>
                <Field label="End" name="end" hint={form.end}>
                  <input id="f-end" name="end" type="time" value={form.end} onChange={handleChange} />
                </Field>
              </div>
            </section>

            {/* ---------- Where ---------- */}
            <section className="evt-block">
              <h2>Where</h2>

              <Field label="Venue" name="venue" error={errors.venue} required>
                <input
                  id="f-venue"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g. The Wheatbaker, Ikoyi"
                />
              </Field>
            </section>

            {/* ---------- Tickets ---------- */}
            <section className="evt-block">
              <div className="evt-block-head">
                <h2>Tickets</h2>
                <span className="evt-block-meta">{totalCapacity} total capacity</span>
              </div>

              {errors.tickets && <p className="form-msg form-msg-block">{errors.tickets}</p>}

              <div className="ticket-rows">
                {form.tickets.map((t) => (
                  <div className="ticket-row" key={t.id}>
                    <div className="ticket-row-inputs">
                      <input
                        aria-label="Ticket name"
                        value={t.name}
                        onChange={(e) => updateTicket(t.id, { name: e.target.value })}
                        placeholder="Tier name"
                      />
                      <div className="ticket-input-prefix">
                        <span>₦</span>
                        <input
                          aria-label="Price"
                          type="number"
                          min="0"
                          value={t.price}
                          onChange={(e) => updateTicket(t.id, { price: Number(e.target.value) })}
                        />
                      </div>
                      <input
                        aria-label="Quantity"
                        type="number"
                        min="1"
                        value={t.quantity}
                        onChange={(e) => updateTicket(t.id, { quantity: Number(e.target.value) })}
                      />
                    </div>

                    <button
                      type="button"
                      className="ticket-remove"
                      onClick={() => removeTicket(t.id)}
                      disabled={form.tickets.length === 1}
                      aria-label={`Remove ${t.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-ghost btn-sm" onClick={addTicket}>
                <PlusIcon /> Add ticket tier
              </button>
            </section>

            {/* ---------- Actions (mobile) ---------- */}
            <div className="evt-form-actions evt-form-actions-inline">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleSave('draft')}
                disabled={saving}
              >
                Save draft
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave('published')}
                disabled={saving}
              >
                {saving ? 'Saving…' : isEdit ? 'Save & publish' : 'Publish event'}
              </button>
            </div>
          </form>

          {/* ---------- Sidebar / preview ---------- */}
          <aside className="evt-form-side" aria-label="Preview">
            <div className="preview-card">
              <span className="preview-eyebrow">Live preview</span>

              <div className="preview-stub" aria-hidden="true">
                <span className="preview-stub-month">{form.month}</span>
                <span className="preview-stub-day">{form.day}</span>
              </div>

              <h3 className="preview-title">{form.title || 'Untitled event'}</h3>
              <p className="preview-venue">{form.venue || 'Venue not set'}</p>
              <p className="preview-time">
                {form.doors} – {form.end}
              </p>

              <div className="preview-tickets">
                {form.tickets.length === 0 ? (
                  <p className="preview-empty">No tickets yet</p>
                ) : (
                  <ul>
                    {form.tickets.map((t) => (
                      <li key={t.id}>
                        <span>{t.name || 'Untitled tier'}</span>
                        <strong>₦{Number(t.price || 0).toLocaleString('en-NG')}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="preview-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-block"
                  onClick={handleSave('draft')}
                  disabled={saving}
                >
                  Save draft
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleSave('published')}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : isEdit ? 'Save & publish' : 'Publish event'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}