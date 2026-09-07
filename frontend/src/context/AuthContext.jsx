import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('k12_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Dr. Evelyn Vance',
      email: 'evelyn.vance@k12quality.edu',
      role: 'Manager',
      schoolId: 'sch-1',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('k12_auth_token') || 'demo-jwt-token-2026');

  useEffect(() => {
    if (user) localStorage.setItem('k12_user', JSON.stringify(user));
    else localStorage.removeItem('k12_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('k12_auth_token', token);
    else localStorage.removeItem('k12_auth_token');
  }, [token]);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    if (response.user) {
      setUser(response.user);
      setToken(response.token || 'demo-token');
      return response;
    }
    throw new Error('Authentication failed');
  };

  const switchRole = (newRole) => {
    const rolePresets = {
      'Manager': { id: 'usr-1', name: 'Dr. Evelyn Vance', email: 'evelyn.vance@k12quality.edu', role: 'Manager', schoolId: 'sch-1', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
      'Quality Engineer': { id: 'usr-2', name: 'Marcus Sterling', email: 'marcus.sterling@k12quality.edu', role: 'Quality Engineer', schoolId: 'sch-2', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
      'Inspector': { id: 'usr-3', name: 'Sophia Chen', email: 'sophia.chen@k12quality.edu', role: 'Inspector', schoolId: 'sch-3', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
      'Auditor': { id: 'usr-4', name: 'Arthur Pendelton', email: 'arthur.p@k12quality.edu', role: 'Auditor', schoolId: 'sch-4', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' }
    };
    const updated = rolePresets[newRole] || rolePresets['Manager'];
    setUser(updated);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('k12_user');
    localStorage.removeItem('k12_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
