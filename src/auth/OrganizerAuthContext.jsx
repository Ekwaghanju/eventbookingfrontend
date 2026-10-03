import { createContext, useContext, useEffect, useState } from 'react';

const OrganizerAuthContext = createContext(null);

const STORAGE_KEY = 'admitone.organizer';

export function OrganizerAuthProvider({ children }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [organizer, setOrganizer] = useState();

  useEffect(() => {
    if (organizer) return;

    async function loadSession() {
      try {
        const res = await fetch(`${apiUrl}/api/v1/organizerauth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not authenticated');
        const { organizer } = await res.json();
        setOrganizer(organizer);
      } catch (err) {
        console.error('Failed to fetch session:', err);
        setOrganizer(null);
      }
    }

    loadSession();
  }, []);

  // TODO: replace with real API calls
  const login = async ({ email, password }) => {
    // call api
    try {
      const res = await fetch(`${apiUrl}/api/v1/organizerauth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!res.ok) throw new Error('Invalid email or password');
      const { organizer } = await res.json();
      setOrganizer(organizer);
    } catch (err) {
      console.error('Failed to login:', err);
      setOrganizer(null);
      throw err;
      
    }

  };

  const signup = async ({ name, email, password, orgName, orgType, phone, website }) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/organizerauth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          orgName,
          orgType,
          phone,
          website,
        }),
      });
      if (!res.ok) {
        const { error, fields } = await res.json().catch(() => ({}));
        const err = new Error(error ?? 'Signup failed');
        err.fields = fields; // so the form can show per-field errors
        throw err;
      }

      const { organizer } = await res.json();
      setOrganizer(organizer);
      return organizer;
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
  try {
    await fetch(`${apiUrl}/api/v1/organizerauth/logout`, {
      method: 'POST',
      credentials: 'include',   // 👈 so the browser accepts the Set-Cookie that clears it
    });
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    setOrganizer(null);         // 👈 always clear local state, even if the request failed
  }
};

  return (
    <OrganizerAuthContext.Provider value={{ organizer, login, signup, logout }}>
      {children}
    </OrganizerAuthContext.Provider>
  );
}

export function useOrganizerAuth() {
  const ctx = useContext(OrganizerAuthContext);
  if (!ctx) throw new Error('useOrganizerAuth must be used inside <OrganizerAuthProvider>');
  return ctx;
}