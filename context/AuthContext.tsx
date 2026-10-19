import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cl_user');
      return stored ? JSON.parse(stored) : {
        id: 'user-demo',
        email: 'user@example.com',
        name: 'Craigslist Member',
        verified: true,
        postedAdsCount: 3
      };
    } catch {
      return null;
    }
  });

  const login = (email: string) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name: email.split('@')[0],
      verified: true,
      postedAdsCount: 1
    };
    setUser(newUser);
    localStorage.setItem('cl_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cl_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
