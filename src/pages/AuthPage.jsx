import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import './AuthPage.css';

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6 0 10 7 10 7a17.5 17.5 0 0 1-3.1 3.9" />
      <path d="M6.7 6.7A17.6 17.6 0 0 0 2 12s4 7 10 7a10.9 10.9 0 0 0 4.3-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function Field({
  label, name, type = 'text', value, onChange,
  error, autoComplete, placeholder, required, trailing,
}) {
  const id = `auth-${name}`;
  return (
    <div className={`auth-field ${error ? 'is-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required && <span className="auth-req">*</span>}
      </label>
      <div className="auth-input-wrap">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        {trailing}
      </div>
      {error && <p id={`${id}-err`} className="auth-field-msg">{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();

  const mode = pathname === '/signup' ? 'signup' : 'login';
  const isSignup = mode === 'signup';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // If already logged in, bounce away
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  // Reset form state when switching between login/signup
  useEffect(() => {
    setErrors({});
    setServerError('');
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (isSignup && !form.name.trim()) next.name = 'Your name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'At least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');
    try {
      if (isSignup) await signup(form);
      else await login(form);

      // Send them wherever they came from, or home
      const params = new URLSearchParams(location.search);
      const next = params.get('next') || '/';
      navigate(next, { replace: true });
    } catch (err) {
      setServerError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="auth">
        <div className="auth-shell">

          {/* ---------- Left / brand panel ---------- */}
          <aside className="auth-aside" aria-hidden="true">
            <div className="auth-aside-inner">
              <span className="auth-aside-eyebrow">Event Booking Platform</span>
              <h2>Find something worth leaving the house for.</h2>
              <p>
                Your tickets, all in one place. Browse events, book in under a minute,
                and keep everything you've bought — even if you forget the email.
              </p>
              <ul className="auth-points">
                <li>Instant confirmation on every order</li>
                <li>Transfer tickets to a friend</li>
                <li>Free cancellation on eligible events</li>
              </ul>
            </div>
            <div className="auth-aside-pattern" />
          </aside>

          {/* ---------- Right / form ---------- */}
          <section className="auth-form-side">
            <header className="auth-head">
              <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
              <p>
                {isSignup
                  ? 'It takes less than a minute. No spam, ever.'
                  : 'Sign in to see your tickets and saved events.'}
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <Field
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  autoComplete="name"
                  placeholder="Ada Okafor"
                  required
                />
              )}

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                placeholder="you@example.com"
                required
              />

              <Field
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                required
                trailing={
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                }
              />

              {!isSignup && (
                <div className="auth-row">
                  <label className="auth-check">
                    <input type="checkbox" defaultChecked />
                    <span>Keep me signed in</span>
                  </label>
                  <a href="/forgot-password" className="auth-link">Forgot password?</a>
                </div>
              )}

              {serverError && (
                <div className="auth-alert" role="alert">{serverError}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting
                  ? (isSignup ? 'Creating account…' : 'Signing in…')
                  : (isSignup ? 'Create account' : 'Sign in')}
              </button>
            </form>

            <p className="auth-switch">
              {isSignup ? (
                <>Already have an account? <Link to="/login">Sign in</Link></>
              ) : (
                <>New here? <Link to="/signup">Create an account</Link></>
              )}
            </p>

            <p className="auth-legal">
              By continuing you agree to our{' '}
              <Link to="/terms">Terms</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}