import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'admitone.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // TODO: replace with real API calls
  const login = async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!email || !password) throw new Error('Missing credentials');
    const next = { id: 'u_1', email, name: email.split('@')[0] };
    setUser(next);
    return next;
  };

  const signup = async ({ name, email, password }) => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email || !password) throw new Error('Missing credentials');
    const next = { id: 'u_' + Date.now(), email, name };
    setUser(next);
    return next;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}