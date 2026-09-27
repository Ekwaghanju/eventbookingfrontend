import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { ALL_EVENTS, THIS_WEEK } from './Homepage.jsx';
import './EventDetails.css';

const ALL = [...THIS_WEEK, ...ALL_EVENTS];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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



function RelatedCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="related-card">
      <div className="related-stub" aria-hidden="true">
        <span className="related-stub-month">{event.month}</span>
        <span className="related-stub-day">{event.day}</span>
        {event.year && <span className="related-stub-year">{event.year}</span>}
      </div>
      <div className="related-body">
        <h4>{event.title}</h4>
        <p>{event.venue}</p>
      </div>
    </Link>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const event = ALL.find((e) => String(e.id) === String(id));

  // Scroll to top when the event changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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

  const related = ALL
    .filter((e) => e.id !== event.id && (e.venue === event.venue || e.month === event.month))
    .slice(0, 4);

  // Fake but plausible detail fields derived from existing data
  const doors = '7:00 PM';
  const start = '8:00 PM';
  const end = '11:00 PM';
  const category = 'Music';

  return (
    <div className="page">
      <Header />

      <article className="event-details">
        <div className="event-details-inner">

          {/* Back link */}
          <Link to="/" className="back-link">
            <ArrowLeft /> Back to events
          </Link>

          {/* Hero */}
          <header className="event-hero">
            <div className="event-hero-media" aria-hidden="true">
              <div className="event-hero-gradient" />
              <span className="event-hero-tag">{category}</span>
            </div>

            <div className="event-hero-info">
              <div className="event-hero-stub" aria-hidden="true">
                <span className="event-hero-stub-month">{event.month}</span>
                <span className="event-hero-stub-day">{event.day}</span>
                {event.year && <span className="event-hero-stub-year">{event.year}</span>}
              </div>

              <h1 className="event-title">{event.title}</h1>

              <ul className="event-meta">
                <li><PinIcon /> {event.venue}</li>
                <li><CalendarIcon /> {event.month} {event.day}, {event.year}</li>
                <li><ClockIcon /> {doors} – {end}</li>
              </ul>
            </div>
          </header>

          {/* Body + sidebar */}
          <div className="event-layout">

            {/* Main column */}
            <main className="event-main">
              <section className="event-block">
                <h2>About this event</h2>
                <p>
                  Join us for {event.title} at {event.venue}. Expect an evening of great
                  energy, good company, and a crowd that actually shows up. Doors open at
                  {' '}{doors}, with the main programme kicking off at {start}.
                </p>
                <p>
                  Whether you're here for the music, the people, or the vibe — this one's
                  worth the trip across town. Arrive early, stay late, and bring a friend.
                </p>
              </section>

              <section className="event-block">
                <h2>Schedule</h2>
                <ul className="event-schedule">
                  <li><span>{doors}</span><strong>Doors open</strong></li>
                  <li><span>{start}</span><strong>Main event begins</strong></li>
                  <li><span>9:30 PM</span><strong>Intermission</strong></li>
                  <li><span>{end}</span><strong>Close</strong></li>
                </ul>
              </section>

              <section className="event-block">
                <h2>Venue</h2>
                <p className="event-venue-line">
                  <PinIcon /> {event.venue}
                </p>
                <div className="event-map" aria-hidden="true">
                  <span>Map preview</span>
                </div>
                <a
                  className="event-directions"
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions →
                </a>
              </section>

              <section className="event-block">
                <h2>Good to know</h2>
                <ul className="event-notes">
                  <li>Bring a valid ID — it may be checked at the door.</li>
                  <li>Tickets are non-refundable but transferable.</li>
                  <li>Photography is welcome. No flash, please.</li>
                </ul>
              </section>
            </main>

            {/* Sidebar (sticky on desktop) */}
            <aside className="event-sidebar" aria-label="Booking">
              <div className="booking-card">
                <div className="booking-price">
                  <span className="booking-price-label">From</span>
                  <span className="booking-price-value">{event.price}</span>
                  <span className="booking-price-per">per ticket</span>
                </div>

                <ul className="booking-facts">
                  <li><CalendarIcon /> {event.month} {event.day}, {event.year}</li>
                  <li><ClockIcon /> {doors} – {end}</li>
                  <li><PinIcon /> {event.venue}</li>
                </ul>

                <Link to={`/checkout/${event.id}`} state={{ event }} className="btn btn-primary btn-block">
                  Get tickets
                </Link>

                <button type="button" className="btn btn-ghost btn-block">
                  Save for later
                </button>

                <p className="booking-note">
                  Free cancellation up to 24 hours before the event.
                </p>
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="event-related">
              <div className="section-heading">
                <h2>You might also like</h2>
                <Link to="/events">See all →</Link>
              </div>
              <div className="related-grid">
                {related.map((r) => <RelatedCard event={r} key={r.id} />)}
              </div>
            </section>
          )}

        </div>
      </article>

      <Footer />
    </div>
  );
}