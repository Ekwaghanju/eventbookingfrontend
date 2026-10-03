import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../partials/Header.jsx';
import Footer from '../partials/Footer.jsx';
import { useOrganizerAuth } from '../../auth/OrganizerAuthContext.jsx';
import './OrganizerAuthPage.css';

const ORG_TYPES = [
  { value: 'independent', label: 'Independent organizer' },
  { value: 'venue', label: 'Venue' },
  { value: 'promoter', label: 'Promoter' },
  { value: 'collective', label: 'Artist collective' },
  { value: 'nonprofit', label: 'Non-profit / community' },
];

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
  label, name, type = 'text', value, onChange, error,
  autoComplete, placeholder, required, trailing, hint,
}) {
  const id = `org-${name}`;
  return (
    <div className={`org-field ${error ? 'is-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required && <span className="org-req">*</span>}
      </label>
      <div className="org-input-wrap">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-err`} className="org-field-msg">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="org-field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- Signup wizard ---------- */
function SignupWizard({ onDone }) {
  const { signup } = useOrganizerAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    orgName: '',
    orgType: 'independent',
    phone: '',
    website: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
    setServerError('');
  };

  const validateStep1 = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Your name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'At least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next = {};
    if (!form.orgName.trim()) next.orgName = 'Organization name is required';
    if (!form.orgType) next.orgType = 'Pick a type';
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      next.website = 'Include http:// or https://';
    }
    if (!form.agree) next.agree = 'You must accept the organizer terms';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const goBack = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const org = await signup(form);
      onDone(org);
    } catch (err) {
      setServerError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="org-form" onSubmit={step === 1 ? goNext : handleSubmit} noValidate>
      {/* Step indicator */}
      <ol className="org-steps" aria-label="Signup progress">
        <li className={step >= 1 ? 'is-active' : ''}>
          <span className="org-step-dot">1</span>
          <span className="org-step-label">Your account</span>
        </li>
        <li className={step >= 2 ? 'is-active' : ''}>
          <span className="org-step-dot">2</span>
          <span className="org-step-label">Organization</span>
        </li>
      </ol>

      {step === 1 && (
        <>
          <p className="org-step-lede">
            First, your own details. This is how we'll reach you about listings and payouts.
          </p>

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

          <Field
            label="Work email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            placeholder="you@yourorg.com"
            required
          />

          <Field
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            hint="Use at least 8 characters, mixing letters and numbers."
            required
            trailing={
              <button
                type="button"
                className="org-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          />

          <button type="submit" className="btn btn-primary btn-block">
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="org-step-lede">
            Now tell us about your organization. You can change any of this later.
          </p>

          <Field
            label="Organization name"
            name="orgName"
            value={form.orgName}
            onChange={handleChange}
            error={errors.orgName}
            autoComplete="organization"
            placeholder="Lagos Live Collective"
            required
          />

          <div className={`org-field ${errors.orgType ? 'is-error' : ''}`}>
            <label htmlFor="org-orgType">Organization type <span className="org-req">*</span></label>
            <select
              id="org-orgType"
              name="orgType"
              value={form.orgType}
              onChange={handleChange}
            >
              {ORG_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {errors.orgType && <p className="org-field-msg">{errors.orgType}</p>}
          </div>

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

          <Field
            label="Website"
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            error={errors.website}
            autoComplete="url"
            placeholder="https://yourorg.com"
            hint="Optional. Helps us verify your organization faster."
          />

          <label className={`org-check ${errors.agree ? 'is-error' : ''}`}>
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span>
              I agree to the <Link to="/terms">organizer terms</Link> and confirm
              I have the right to list events under this organization.
            </span>
          </label>
          {errors.agree && <p className="org-field-msg">{errors.agree}</p>}

          {serverError && (
            <div className="org-alert" role="alert">{serverError}</div>
          )}

          <div className="org-step-actions">
            <button type="button" className="btn btn-ghost" onClick={goBack} disabled={submitting}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create organizer account'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

/* ---------- Login form ---------- */
function LoginForm({ onDone }) {
  const { login } = useOrganizerAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const org = await login(form);
      onDone(org);
    } catch (err) {
      setServerError(err?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="org-form" onSubmit={handleSubmit} noValidate>
      <Field
        label="Work email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
        placeholder="you@yourorg.com"
        required
      />

      <Field
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="current-password"
        placeholder="Your password"
        required
        trailing={
          <button
            type="button"
            className="org-eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        }
      />

      <div className="org-row">
        <label className="org-check">
          <input type="checkbox" defaultChecked />
          <span>Keep me signed in</span>
        </label>
        <Link to="/organizer/forgot-password" className="org-link">Forgot password?</Link>
      </div>

      {serverError && <div className="org-alert" role="alert">{serverError}</div>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

/* ---------- Page ---------- */
export default function OrganizerAuthPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { organizer } = useOrganizerAuth();

  const mode = pathname === '/organizer/signup' ? 'signup' : 'login';
  const isSignup = mode === 'signup';

  // Already signed in → dashboard
  useEffect(() => {
    if (organizer) navigate('/organizer/dashboard', { replace: true });
  }, [organizer, navigate]);

  const onDone = () => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next') || '/organizer/dashboard';
    navigate(next, { replace: true });
  };

  return (
    <div className="page">
      <Header />

      <main className="org-auth">
        <div className="org-shell">

          {/* Left / brand */}
          <aside className="org-aside" aria-hidden="true">
            <div className="org-aside-inner">
              <span className="org-aside-eyebrow">For organizers</span>
              <h2>Sell tickets without the runaround.</h2>
              <p>
                List an event in minutes, get paid fast, and see exactly who's coming.
                Built for independent organizers, venues, and collectives.
              </p>
              <ul className="org-points">
                <li>Payouts within 3 business days</li>
                <li>Real-time sales dashboard</li>
                <li>Free to list — pay only when you sell</li>
              </ul>
            </div>
            <div className="org-aside-pattern" />
          </aside>

          {/* Right / form */}
          <section className="org-form-side">
            <header className="org-head">
              <h1>{isSignup ? 'Become an organizer' : 'Organizer sign in'}</h1>
              <p>
                {isSignup
                  ? 'Two quick steps. You can start listing right after.'
                  : 'Access your dashboard, events, and payouts.'}
              </p>
            </header>

            {isSignup ? (
              <SignupWizard onDone={onDone} />
            ) : (
              <LoginForm onDone={onDone} />
            )}

            <p className="org-switch">
              {isSignup ? (
                <>Already an organizer? <Link to="/organizer/login">Sign in</Link></>
              ) : (
                <>New to EBP? <Link to="/organizer/signup">Create an organizer account</Link></>
              )}
            </p>

            <p className="org-legal">
              By continuing you agree to our <Link to="/terms">Terms</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}