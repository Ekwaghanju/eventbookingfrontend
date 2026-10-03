import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../partials/Header.jsx';
import Footer from '../partials/Footer.jsx';
import { useOrganizerAuth } from '../../auth/OrganizerAuthContext.jsx';
import { loadEvents, loadAttendees, saveAttendees } from '../../data/OrganizerEvent.js';
import { formatEventDate } from '../Homepage.jsx';
import './OrganizerEventDetails.css';
import AttendeeDrawer from './AttendeeDrawer.jsx';

function ArrowLeft() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function DownloadIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
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

function formatMoney(n) {
    return `₦${Number(n || 0).toLocaleString('en-NG')}`;
}

function formatDateTime(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleString('en-NG', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

// Converts attendees to a CSV string and triggers a download
function exportCsv(event, attendees) {
    const headers = ['Name', 'Email', 'Phone', 'Ticket tier', 'Checked in', 'Purchased at'];
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = attendees.map((a) => [
        a.name, a.email, a.phone, a.tier, a.checkedIn ? 'yes' : 'no', a.purchasedAt,
    ].map(escape).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-attendees.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'checked', label: 'Checked in' },
    { key: 'pending', label: 'Not checked in' },
];

export default function OrganizerEventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { organizer } = useOrganizerAuth();

    const [event] = useState(() => loadEvents().find((e) => e.id === id));
    const [attendees, setAttendees] = useState(() => loadAttendees(id));
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [scanValue, setScanValue] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    useEffect(() => {
        if (event) saveAttendees(id, attendees);
    }, [id, attendees, event]);

    const stats = useMemo(() => {
        const sold = attendees.length;
        const checked = attendees.filter((a) => a.checkedIn).length;
        const revenue = attendees.reduce((sum, a) => {
            const tier = event?.tickets?.find((t) => t.name === a.tier);
            return sum + (tier?.price ?? 0);
        }, 0);
        const capacity = (event?.tickets ?? []).reduce((n, t) => n + (t.quantity ?? 0), 0);
        return { sold, checked, revenue, capacity, pending: sold - checked };
    }, [attendees, event]);

    const tierBreakdown = useMemo(() => {
        if (!event) return [];
        return (event.tickets ?? []).map((t) => {
            const soldInTier = attendees.filter((a) => a.tier === t.name).length;
            return {
                ...t,
                soldInTier,
                revenue: soldInTier * (t.price ?? 0),
                pct: t.quantity > 0 ? Math.min(100, Math.round((soldInTier / t.quantity) * 100)) : 0,
            };
        });
    }, [event, attendees]);

    const visibleAttendees = useMemo(() => {
        const q = query.trim().toLowerCase();
        return attendees.filter((a) => {
            if (filter === 'checked' && !a.checkedIn) return false;
            if (filter === 'pending' && a.checkedIn) return false;
            if (!q) return true;
            return (
                a.name.toLowerCase().includes(q) ||
                a.email.toLowerCase().includes(q) ||
                a.phone.toLowerCase().includes(q)
            );
        });
    }, [attendees, query, filter]);

    const toggleCheckIn = (attendeeId) => {
        setAttendees((list) =>
            list.map((a) => (a.id === attendeeId ? { ...a, checkedIn: !a.checkedIn } : a))
        );
    };


    // Simulated scan: matches by email, phone digits, or id
    const handleScan = (e) => {
        e.preventDefault();
        const raw = scanValue.trim().toLowerCase();
        if (!raw) return;

        const digits = raw.replace(/\D/g, '');
        const match = attendees.find((a) =>
            a.id.toLowerCase() === raw ||
            a.email.toLowerCase() === raw ||
            (digits && a.phone.replace(/\D/g, '').includes(digits))
        );

        if (!match) {
            setScanResult({ ok: false, message: 'No matching ticket found.' });
        } else if (match.checkedIn) {
            setScanResult({ ok: false, message: `${match.name} is already checked in.`, attendee: match });
        } else {
            setAttendees((list) =>
                list.map((a) => (a.id === match.id ? { ...a, checkedIn: true } : a))
            );
            setScanResult({ ok: true, message: `${match.name} checked in.`, attendee: match });
        }
        setScanValue('');
    };




    const selectedAttendee = useMemo(
        () => attendees.find((a) => a.id === selectedId) ?? null,
        [attendees, selectedId]
    );

    const selectedTier = useMemo(
        () => event?.tickets?.find((t) => t.name === selectedAttendee?.tier) ?? null,
        [event, selectedAttendee]
    );

    const closeDrawer = () => setSelectedId(null);

    const handleResend = (attendee) => {
        // TODO: replace with real API call
        console.log('Resend ticket to', attendee.email);
    };

    const handleRefund = (attendee) => {
        if (!confirm(`Refund ${attendee.name}'s ticket? This cannot be undone.`)) return;
        setAttendees((list) => list.filter((a) => a.id !== attendee.id));
        setSelectedId(null);
    };

    if (!organizer) {
        return (
            <div className="page">
                <Header />
                <section className="dash-empty">
                    <h1>You're not signed in</h1>
                    <p>Sign in to view your event.</p>
                    <Link to="/organizer/login" className="btn btn-primary">Organizer sign in</Link>
                </section>
                <Footer />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="page">
                <Header />
                <section className="dash-empty">
                    <h1>Event not found</h1>
                    <p>It may have been deleted or the link is broken.</p>
                    <Link to="/organizer/dashboard" className="btn btn-primary">Back to dashboard</Link>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page">
            <Header />

            <main className="evt">
                <Link to="/organizer/dashboard" className="back-link">
                    <ArrowLeft /> Back to dashboard
                </Link>

                {/* ---------- Header ---------- */}
                <header className="evt-head">
                    <div className="evt-head-copy">
                        <div className="evt-head-meta">
                            <span className={`status-pill status-${event.status === 'published' ? 'ok' : 'neutral'}`}>
                                {event.status}
                            </span>
                            <span className="evt-head-category">{event.category}</span>
                        </div>
                        <h1>{event.title}</h1>
                        <p className="evt-head-line">
                            {formatEventDate(event)} · {event.doors}–{event.end} · {event.venue}
                        </p>
                    </div>

                    <div className="evt-head-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => exportCsv(event, attendees)}
                            disabled={attendees.length === 0}
                        >
                            <DownloadIcon /> Export CSV
                        </button>
                        <Link to={`/organizer/events/${event.id}/edit`} className="btn btn-primary">
                            Edit event
                        </Link>
                    </div>
                </header>

                {/* ---------- Stats ---------- */}
                <section className="evt-stats" aria-label="Event overview">
                    <article className="stat-card">
                        <span className="stat-label">Revenue</span>
                        <span className="stat-value">{formatMoney(stats.revenue)}</span>
                        <span className="stat-sub">from {stats.sold} tickets</span>
                    </article>
                    <article className="stat-card">
                        <span className="stat-label">Tickets sold</span>
                        <span className="stat-value">{stats.sold}</span>
                        <span className="stat-sub">of {stats.capacity} capacity</span>
                    </article>
                    <article className="stat-card">
                        <span className="stat-label">Checked in</span>
                        <span className="stat-value">{stats.checked}</span>
                        <span className="stat-sub">{stats.pending} still to arrive</span>
                    </article>
                    <article className="stat-card">
                        <span className="stat-label">Tiers</span>
                        <span className="stat-value">{event.tickets?.length ?? 0}</span>
                        <span className="stat-sub">on sale</span>
                    </article>
                </section>

                {/* ---------- Layout ---------- */}
                <div className="evt-layout">

                    {/* ---------- Attendee list ---------- */}
                    <section className="evt-attendees">
                        <div className="evt-block-head">
                            <h2>Attendees</h2>
                            <span className="evt-block-meta">
                                {visibleAttendees.length} of {attendees.length}
                            </span>
                        </div>

                        <div className="evt-toolbar">
                            <div className="evt-search">
                                <SearchIcon />
                                <input
                                    type="search"
                                    placeholder="Search name, email, or phone"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-label="Search attendees"
                                />
                            </div>

                            <div className="evt-filters" role="tablist" aria-label="Attendee status">
                                {FILTERS.map((f) => (
                                    <button
                                        key={f.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={filter === f.key}
                                        className={filter === f.key ? 'evt-filter is-active' : 'evt-filter'}
                                        onClick={() => setFilter(f.key)}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {visibleAttendees.length === 0 ? (
                            <div className="evt-empty">
                                <h3>No attendees match</h3>
                                <p>Try clearing the search or switching filters.</p>
                            </div>
                        ) : (
                            <div className="evt-table-wrap">
                                <table className="evt-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Contact</th>
                                            <th scope="col">Tier</th>
                                            <th scope="col">Purchased</th>
                                            <th scope="col" className="evt-th-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleAttendees.map((a) => (
                                            <tr
                                                key={a.id}
                                                className={`${a.checkedIn ? 'is-checked' : ''} ${selectedId === a.id ? 'is-selected' : ''}`}
                                                onClick={() => setSelectedId(a.id)}
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setSelectedId(a.id);
                                                    }
                                                }}
                                                role="button"
                                                aria-label={`Open details for ${a.name}`}
                                            >
                                                {/* ...existing cells... */}
                                                <td data-label="Status" className="evt-td-right">
                                                    <button
                                                        type="button"
                                                        className={a.checkedIn ? 'evt-status is-in' : 'evt-status'}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // don't open the drawer
                                                            toggleCheckIn(a.id);
                                                        }}
                                                        aria-pressed={a.checkedIn}
                                                    >
                                                        {a.checkedIn ? <><CheckIcon /> Checked in</> : 'Not yet'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* ---------- Sidebar ---------- */}
                    <aside className="evt-side">

                        {/* Check-in scanner */}
                        <section className="evt-card">
                            <div className="evt-block-head">
                                <h2>Check-in</h2>
                            </div>
                            <p className="evt-card-lede">
                                Scan or paste a ticket reference, email, or phone number.
                            </p>

                            <form className="evt-scan" onSubmit={handleScan}>
                                <input
                                    type="text"
                                    placeholder="e.g. ada@example.com"
                                    value={scanValue}
                                    onChange={(e) => setScanValue(e.target.value)}
                                    aria-label="Scan or enter ticket reference"
                                />
                                <button type="submit" className="btn btn-primary">Check in</button>
                            </form>

                            {scanResult && (
                                <div
                                    className={`evt-scan-result ${scanResult.ok ? 'is-ok' : 'is-warn'}`}
                                    role="status"
                                    aria-live="polite"
                                >
                                    {scanResult.message}
                                </div>
                            )}
                        </section>

                        {/* Tier breakdown */}
                        <section className="evt-card">
                            <div className="evt-block-head">
                                <h2>Sales by tier</h2>
                            </div>

                            {tierBreakdown.length === 0 ? (
                                <p className="evt-card-lede">No ticket tiers yet.</p>
                            ) : (
                                <ul className="tier-list">
                                    {tierBreakdown.map((t) => (
                                        <li key={t.id} className="tier-item">
                                            <div className="tier-item-head">
                                                <strong>{t.name}</strong>
                                                <span>{formatMoney(t.price)}</span>
                                            </div>
                                            <div className="tier-bar" aria-hidden="true">
                                                <div className="tier-bar-fill" style={{ width: `${t.pct}%` }} />
                                            </div>
                                            <div className="tier-item-foot">
                                                <span>{t.soldInTier} / {t.quantity} sold</span>
                                                <span>{formatMoney(t.revenue)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Quick facts */}
                        <section className="evt-card">
                            <div className="evt-block-head">
                                <h2>Details</h2>
                            </div>
                            <dl className="evt-facts">
                                <div><dt>Venue</dt><dd>{event.venue}</dd></div>
                                <div><dt>Doors</dt><dd>{event.doors}</dd></div>
                                <div><dt>Start</dt><dd>{event.start}</dd></div>
                                <div><dt>End</dt><dd>{event.end}</dd></div>
                                <div><dt>Category</dt><dd>{event.category}</dd></div>
                            </dl>
                        </section>
                    </aside>
                </div>

                <AttendeeDrawer
                    attendee={selectedAttendee}
                    tier={selectedTier}
                    orderRef={`AO-${selectedAttendee?.id?.slice(-6).toUpperCase() ?? ''}`}
                    onClose={closeDrawer}
                    onToggleCheckIn={toggleCheckIn}
                    onResend={handleResend}
                    onRefund={handleRefund}
                />

            </main>

            <Footer />
        </div>
    );
}