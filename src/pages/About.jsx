import { Link } from 'react-router-dom';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import './About.css';

function TicketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <line x1="9" y1="8" x2="9" y2="16" strokeDasharray="2 2" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const VALUES = [
  {
    icon: <TicketIcon />,
    title: 'Frictionless by default',
    body: 'No account required to buy. No dark patterns. No surprise fees at the last step. If it feels like work, we did it wrong.',
  },
  {
    icon: <SparkIcon />,
    title: 'Built for real events',
    body: 'From 20-person pottery classes to 5,000-seat concerts, the same platform works — because organizers shouldn\'t need three tools.',
  },
  {
    icon: <HeartIcon />,
    title: 'Backing local culture',
    body: 'Lagos has one of the most vibrant event scenes in the world. We exist to make it easier to find, book, and show up.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Money you can trust',
    body: 'Payments settle fast. Refunds are transparent. Tickets are yours — you can transfer them to a friend in two taps.',
  },
];

const STATS = [
  { value: '1,200+', label: 'Events listed' },
  { value: '85k', label: 'Tickets sold' },
  { value: '340', label: 'Organizers onboard' },
  { value: '4.8★', label: 'Average event rating' },
];

const TEAM = [
  { name: 'Ekwaghanju Theodore', role: 'Co-founder & CEO', initials: 'ET', accent: '#d4452f' },
  { name: 'Ekwaghanju Theodore', role: 'CTO', initials: 'ET', accent: '#2f6b4f' },
  { name: 'Zainab Yusuf', role: 'Head of Design', initials: 'ZY', accent: '#b78024' },
  { name: 'Chidi Nwosu', role: 'Head of Organizer Success', initials: 'CN', accent: '#5a4b9a' },
];

export default function About() {
  return (
    <div className="page">
      <Header />

      <main className="about">

        {/* ---------- Hero ---------- */}
        <section className="about-hero">
          <div className="about-hero-inner">
            <span className="about-eyebrow">About us</span>
            <h1>
              We make it easy to find <em>something worth leaving the house for.</em>
            </h1>
            <p className="about-lede">
              Admit One is a small ticketing platform built in Lagos, for the people who
              organize events and the people who show up. No clutter, no runaround, no
              accounts you don't need.
            </p>

            <div className="about-hero-actions">
              <Link to="/events" className="btn btn-primary">Browse events</Link>
              <Link to="/organizer/login" className="btn btn-ghost">Sell tickets</Link>
            </div>
          </div>
          <div className="about-hero-art" aria-hidden="true">
            <div className="about-blob about-blob-a" />
            <div className="about-blob about-blob-b" />
            <div className="about-blob about-blob-c" />
          </div>
        </section>

        {/* ---------- Stats strip ---------- */}
        <section className="about-stats" aria-label="Platform numbers">
          {STATS.map((s) => (
            <div className="about-stat" key={s.label}>
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ---------- Story ---------- */}
        <section className="about-story">
          <div className="about-story-inner">
            <span className="about-section-eyebrow">Our story</span>
            <h2>Started because we missed a show we really wanted to see.</h2>
            <div className="about-story-body">
              <p>
                In 2024, a friend told us about an Afrobeats night at a venue ten minutes
                from our flat. By the time we found the ticket link — buried in an
                Instagram bio, behind a login wall, on a site that timed out twice — the
                show was sold out.
              </p>
              <p>
                We spent the next weekend sketching what a ticketing platform would look
                like if it respected both the person buying and the person selling. Two
                buttons. One clear price. A ticket that actually arrives in your inbox.
              </p>
              <p>
                Admit One is that sketch, built out. We're still small, still based in
                Lagos, and still annoyed every time a checkout flow makes us create an
                account we'll never use again.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Values ---------- */}
        <section className="about-values">
          <div className="about-section-head">
            <span className="about-section-eyebrow">What we believe</span>
            <h2>The principles behind every decision</h2>
          </div>

          <div className="about-values-grid">
            {VALUES.map((v) => (
              <article className="value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <section className="about-team">
          <div className="about-section-head">
            <span className="about-section-eyebrow">The team</span>
            <h2>Small team, big opinions about checkout UX</h2>
          </div>

          <div className="about-team-grid">
            {TEAM.map((m) => (
              <article className="team-card" key={m.name}>
                <span
                  className="team-avatar"
                  style={{ background: m.accent }}
                  aria-hidden="true"
                >
                  {m.initials}
                </span>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="about-cta">
          <div className="about-cta-inner">
            <h2>Ready to find your next night out?</h2>
            <p>
              Browse what's happening this week, or list your own event in under five
              minutes.
            </p>
            <div className="about-cta-actions">
              <Link to="/events" className="btn btn-primary">Browse events</Link>
              <Link to="/organizer/login" className="btn btn-ghost">Become an organizer</Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}