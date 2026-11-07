import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginRequest, registerRequest, fetchMe } from '../api/services.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, validate it and restore the session.
  useEffect(() => {
    const token = localStorage.getItem('foodspot_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('foodspot_token'))
      .finally(() => setLoading(false));
  }, []);

  const persist = (data) => {
    localStorage.setItem('foodspot_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const login = useCallback(async (credentials) => persist(await loginRequest(credentials)), []);
  const register = useCallback(async (payload) => persist(await registerRequest(payload)), []);

  const logout = useCallback(() => {
    localStorage.removeItem('foodspot_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
