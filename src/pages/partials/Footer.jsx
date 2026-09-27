import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">

        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <span className="footer-logo-mark" aria-hidden="true">A1</span>
              Event Booking Platform
            </a>
            <p className="footer-tagline">
              A small ticketing platform for the events worth leaving the house for.
            </p>

            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          <nav className="footer-cols" aria-label="Footer">
            <div className="footer-col">
              <h4>Discover</h4>
              <a href="/events">Browse events</a>
              <a href="/events?range=week">This week</a>
              <a href="/events?range=weekend">This weekend</a>
              <a href="/cities">Cities</a>
            </div>

            <div className="footer-col">
              <h4>Organizers</h4>
              <a href="/organizer/login">Organizer login</a>
              <a href="/organizer/signup">Sell tickets</a>
              <a href="/pricing">Pricing</a>
              <a href="/help">Help centre</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="/careers">Careers</a>
              <a href="/contact">Contact</a>
              <a href="/press">Press</a>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/cookies">Cookies</a>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TD Event Booking Platform. All rights reserved.</span>
          <div className="footer-social">
            <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
            <a href="https://instagram.com" aria-label="Instagram">Instagram</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
}