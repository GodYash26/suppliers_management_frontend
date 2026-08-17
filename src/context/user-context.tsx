'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { USERS, UserId } from '@/types/supplier';

interface UserContextType {
  userId: UserId;
  user: (typeof USERS)[UserId];
  setUserId: (id: UserId) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<UserId>('anna');

  useEffect(() => {
    const stored = localStorage.getItem('userId') as UserId;
    if (stored && USERS[stored]) setUserIdState(stored);
  }, []);

  const setUserId = (id: UserId) => {
    localStorage.setItem('userId', id);
    setUserIdState(id);
  };

  return (
    <UserContext.Provider value={{ userId, user: USERS[userId], setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}