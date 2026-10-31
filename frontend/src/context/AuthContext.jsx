import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myBookingsModalOpen, setMyBookingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify with backend
    if (token) {
      authService
        .getMe()
        .then((userData) => {
          if (userData) setUser(userData);
        })
        .catch(() => {
          // Token expired or invalid
          authService.logout();
          setUser(null);
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToken(data.token);
    setAuthModalOpen(false);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setUser(data.user);
    setToken(data.token);
    setAuthModalOpen(false);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        authModalOpen,
        setAuthModalOpen,
        myBookingsModalOpen,
        setMyBookingsModalOpen,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
