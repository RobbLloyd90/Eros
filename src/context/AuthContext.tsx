import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../storage/database';
import { WebAuthnAPI } from '../utils/webauthn';
import type { UserProfile, ThemeType, ChartConfig } from '../types';

interface AuthContextType {
  users: Record<string, UserProfile>;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loginWithPin: (userId: string, pin: string) => boolean;
  loginWithBiometrics: (userId: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, pin: string, theme: ThemeType) => UserProfile;
  deleteAccount: (userId: string) => void; // New explicit layout method
  enrollBiometrics: () => Promise<boolean>;
  removeBiometrics: () => void;
  updateTheme: (theme: ThemeType) => void;
  updateCharts: (charts: ChartConfig[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const hashPin = (pin: string) => btoa(`os_finance_${pin}`);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<Record<string, UserProfile>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const loginWithPin = (userId: string, pin: string) => {
    const user = users[userId];
    if (user && user.pinHash === hashPin(pin)) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const loginWithBiometrics = async (userId: string) => {
    const user = users[userId];
    if (!user || !user.fidoCredential) return false;
    try {
      const success = await WebAuthnAPI.authenticate(user.fidoCredential.rawId);
      if (success) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const registerUser = (name: string, pin: string, theme: ThemeType) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      pinHash: hashPin(pin),
      theme,
      createdAt: new Date().toISOString()
    };
    db.saveUser(newUser);
    setUsers(db.getUsers());
    return newUser;
  };

  const deleteAccount = (userId: string) => {
    db.deleteUser(userId);
    setUsers(db.getUsers());
    logout();
  };

  const enrollBiometrics = async () => {
    if (!currentUser) return false;
    try {
      const cred = await WebAuthnAPI.register(currentUser.id, currentUser.name);
      const updatedUser = { ...currentUser, fidoCredential: cred };
      db.saveUser(updatedUser);
      setUsers(db.getUsers());
      setCurrentUser(updatedUser);
      return true;
    } catch (e) {
      return false;
    }
  };

  const removeBiometrics = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, fidoCredential: null };
    db.saveUser(updatedUser);
    setUsers(db.getUsers());
    setCurrentUser(updatedUser);
  };

  const updateTheme = (newTheme: ThemeType) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, theme: newTheme };
    db.saveUser(updatedUser);
    setUsers(db.getUsers());
    setCurrentUser(updatedUser);
  };

  const updateCharts = (newCharts: ChartConfig[]) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, charts: newCharts };
    db.saveUser(updatedUser);
    setUsers(db.getUsers());
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated,
        loginWithPin,
        loginWithBiometrics,
        logout,
        registerUser,
        deleteAccount,
        enrollBiometrics,
        removeBiometrics,
        updateTheme,
        updateCharts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
