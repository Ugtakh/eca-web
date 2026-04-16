'use client';

import type { Models } from 'node-appwrite';

import { type ReactNode, createContext, useContext, useState } from 'react';

interface AuthContextType {
  current: Models.User | null;
  setCurrent: (user: Models.User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: ReactNode;
  user: Models.User | null;
}> = ({ children, user }) => {
  const [current, setCurrent] = useState<Models.User | null>(user);

  return (
    <AuthContext.Provider
      value={{
        current,
        setCurrent,
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
