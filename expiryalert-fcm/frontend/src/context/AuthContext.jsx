import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const Ctx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = localStorage.getItem('ea_token');
      if (t) { try { const { data } = await api.get('/auth/me'); setUser(data); } catch { localStorage.removeItem('ea_token'); } }
      setLoading(false);
    })();
  }, []);

  const login = async (payload, mode = 'login') => {
    const { data } = await api.post(`/auth/${mode === 'login' ? 'login' : 'register'}`, payload);
    localStorage.setItem('ea_token', data.token);
    setUser(data);
  };

  const logout = () => { localStorage.removeItem('ea_token'); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
