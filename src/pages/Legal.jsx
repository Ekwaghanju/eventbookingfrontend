import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { TERMS, PRIVACY } from '../data/Legal.js';
import './Legal.css';

const DOCS = {
  '/terms': TERMS,
  '/privacy': PRIVACY,
};

export default function Legal() {
  const { pathname } = useLocation();
  const doc = DOCS[pathname] ?? TERMS;

  // Scroll to top when switching between legal pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="page">
      <Header />

      <article className="legal">
        <div className="legal-inner">

          <nav className="legal-tabs" aria-label="Legal pages">
            <Link
              to="/terms"
              className={pathname === '/terms' ? 'legal-tab is-active' : 'legal-tab'}
              aria-current={pathname === '/terms' ? 'page' : undefined}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className={pathname === '/privacy' ? 'legal-tab is-active' : 'legal-tab'}
              aria-current={pathname === '/privacy' ? 'page' : undefined}
            >
              Privacy Policy
            </Link>
          </nav>

          <header className="legal-header">
            <h1>{doc.title}</h1>
            <p className="legal-updated">Last updated {doc.updated}</p>
          </header>

          <p className="legal-intro">{doc.intro}</p>

          <div className="legal-body">
            {doc.sections.map((section) => (
              <section key={section.heading} className="legal-section">
                <h2>{section.heading}</h2>

                {section.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}

                {section.bullets && (
                  <ul>
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <aside className="legal-contact">
            <p>
              Still have questions?{' '}
              <a href="mailto:etheodore9@gmail.com">Get in touch</a>.
            </p>
          </aside>

        </div>
      </article>

      <Footer />
    </div>
  );
}