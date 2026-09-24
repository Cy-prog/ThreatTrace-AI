import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginPayload, RegisterPayload } from '../types/auth';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('threattrace_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('threattrace_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
          localStorage.setItem('threattrace_user', JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    localStorage.setItem('threattrace_token', res.accessToken);
    localStorage.setItem('threattrace_refresh_token', res.refreshToken);
    localStorage.setItem('threattrace_user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
  };

  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
    await login({ username: payload.username, password: payload.password });
  };

  const logout = () => {
    localStorage.removeItem('threattrace_token');
    localStorage.removeItem('threattrace_refresh_token');
    localStorage.removeItem('threattrace_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    const formatted = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    return user.roles.includes(formatted) || user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
