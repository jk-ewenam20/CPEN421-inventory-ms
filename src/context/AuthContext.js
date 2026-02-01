import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/*
 * JWTs use base64url encoding (replaces + → - and / → _).
 * Browser atob() only understands standard base64, so we must
 * convert back before decoding.  This was the crash on login.
 */
function decodeJwtPayload(token) {
  const base64url = token.split('.')[1];
  const base64    = base64url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── hydrate from localStorage on first render ── */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* corrupt – ignore */ }
    }
    setLoading(false);
  }, []);

  /*
   * login
   * 1. POST /api/users/auth   { email, password }
   *    → { data: "<jwt>", message }
   * 2. Decode JWT to get _id
   * 3. GET  /api/users/:id   → { user: { _id, name, email } }
   * 4. Persist & update state
   */
  const login = useCallback(async (email, password) => {
    const authRes = await api.post('/users/auth', { email, password });
    const token   = authRes.data.data;

    // store token first so the axios interceptor can attach it
    localStorage.setItem('token', token);

    // safely decode base64url JWT payload
    const payload  = decodeJwtPayload(token);
    const userRes  = await api.get(`/users/${payload._id}`);
    const userData = userRes.data.user;

    // never persist the hashed password client-side
    const { password: _pw, ...safe } = userData;

    localStorage.setItem('user', JSON.stringify(safe));
    setUser(safe);
    return safe;
  }, []);

  /*
   * register
   * POST /api/users  { name, email, password }
   * → { data: { _id, name, email, … }, message }
   */
  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/users', { name, email, password });
    return res.data.data;
  }, []);

  /* ── logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
