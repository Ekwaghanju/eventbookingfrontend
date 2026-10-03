import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header.jsx';
import Footer from '../partials/Footer.jsx';
import { useOrganizerAuth } from '../../auth/OrganizerAuthContext.jsx';
import { loadEvents, saveEvents } from '../../data/OrganizerEvent.js';
import {  formatEventDate } from '../Homepage.jsx';
import './OrganizerDashboard.css';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function formatMoney(n) {
  return `₦${Number(n || 0).toLocaleString('en-NG')}`;
}

function StatusPill({ status }) {
  const map = {
    published: { label: 'Published', tone: 'ok' },
    draft: { label: 'Draft', tone: 'neutral' },
    ended: { label: 'Ended', tone: 'muted' },
  };
  const s = map[status] ?? map.draft;
  return <span className={`status-pill status-${s.tone}`}>{s.label}</span>;
}

function computeStats(events) {
  let revenue = 0;
  let sold = 0;
  let capacity = 0;
  for (const e of events) {
    for (const t of e.tickets ?? []) {
      sold += t.sold ?? 0;
      capacity += t.quantity ?? 0;
      revenue += (t.sold ?? 0) * (t.price ?? 0);
    }
  }
  return { revenue, sold, capacity, published: events.filter((e) => e.status === 'published').length };
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
];

export default function OrganizerDashboard() {
  const { organizer, logout } = useOrganizerAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => loadEvents());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const stats = useMemo(() => computeStats(events), [events]);

  const visible = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.status === filter)),
    [events, filter]
  );

  const handleDelete = (id) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setEvents((list) => list.filter((e) => e.id !== id));
  };

  const handleTogglePublish = (id) => {
    setEvents((list) =>
      list.map((e) =>
        e.id === id
          ? { ...e, status: e.status === 'published' ? 'draft' : 'published' }
          : e
      )
    );
  };

  if (!organizer) {
    return (
      <div className="page">
        <Header />
        <section className="dash-empty">
          <h1>You're not signed in</h1>
          <p>Sign in to access your organizer dashboard.</p>
          <Link to="/organizer/login" className="btn btn-primary">Organizer sign in</Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="dash">
        {/* ---------- Header ---------- */}
        <header className="dash-head">
          <div className="dash-head-copy">
            <span className="dash-eyebrow">Organizer dashboard</span>
            <h1>{organizer.orgName}</h1>
            <p>
              {organizer.verified
                ? 'Your account is verified.'
                : 'Your account is under review — you can still draft events.'}
            </p>
          </div>

          <div className="dash-head-actions">
            
            <Link to="/organizer/events/new" className="btn btn-primary">
              <PlusIcon /> Create event
            </Link>
          </div>
        </header>

        {/* ---------- Stats ---------- */}
        <section className="dash-stats" aria-label="Overview">
          <article className="stat-card">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">{formatMoney(stats.revenue)}</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Tickets sold</span>
            <span className="stat-value">{stats.sold}</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Capacity</span>
            <span className="stat-value">{stats.capacity}</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Published events</span>
            <span className="stat-value">{stats.published}</span>
          </article>
        </section>

        {/* ---------- Events list ---------- */}
        <section className="dash-events">
          <div className="dash-events-head">
            <h2>Your events</h2>
            <div className="dash-filters" role="tablist" aria-label="Event status">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.key}
                  className={filter === f.key ? 'dash-filter is-active' : 'dash-filter'}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="dash-empty-inline">
              <h3>No events here yet</h3>
              <p>Create your first event and start selling tickets.</p>
              <Link to="/organizer/events/new" className="btn btn-primary">
                <PlusIcon /> Create event
              </Link>
            </div>
          ) : (
            <ul className="events-list">
              {visible.map((e) => {
                const sold = (e.tickets ?? []).reduce((n, t) => n + (t.sold ?? 0), 0);
                const cap = (e.tickets ?? []).reduce((n, t) => n + (t.quantity ?? 0), 0);
                const revenue = (e.tickets ?? []).reduce((n, t) => n + (t.sold ?? 0) * (t.price ?? 0), 0);
                const pct = cap > 0 ? Math.min(100, Math.round((sold / cap) * 100)) : 0;

                return (
                  <li key={e.id} className="event-row">
                    <div className="event-row-stub" aria-hidden="true">
                      <span className="event-row-month">{e.month}</span>
                      <span className="event-row-day">{e.day}</span>
                    </div>

                    <div className="event-row-body">
                      <div className="event-row-top">
                        <Link to={`/organizer/events/${e.id}`} className="event-row-link">
                          <h3>{e.title}</h3>
                        </Link>
                        <StatusPill status={e.status} />
                      </div>
                      <p className="event-row-meta">
                        {formatEventDate(e)} · {e.doors}–{e.end} · {e.venue}
                      </p>

                      <div className="event-row-progress" aria-hidden="true">
                        <div className="event-row-bar" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="event-row-numbers">
                        <span><strong>{sold}</strong> / {cap} sold</span>
                        <span>{formatMoney(revenue)}</span>
                      </p>
                    </div>

                    <div className="event-row-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleTogglePublish(e.id)}
                      >
                        {e.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        to={`/organizer/events/${e.id}/edit`}
                        className="btn btn-ghost btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}