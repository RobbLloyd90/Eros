import type { UserProfile, GlobalLedger } from '../types';
import { INITIAL_LEDGER } from '../config';

const USERS_KEY = 'os_finance_users';
const LEDGER_PREFIX = 'os_finance_ledger_';

export const db = {
  // --- USER MANAGEMENT ---
  getUsers: (): Record<string, UserProfile> => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveUser: (user: UserProfile) => {
    const users = db.getUsers();
    users[user.id] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // If it's a new user, initialize an empty ledger for them
    if (!localStorage.getItem(`${LEDGER_PREFIX}${user.id}`)) {
      db.saveLedger(user.id, INITIAL_LEDGER); // Give them the starter data
    }
  },

  deleteUser: (userId: string) => {
    const users = db.getUsers();
    delete users[userId];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(`${LEDGER_PREFIX}${userId}`);
  },

  // --- LEDGER MANAGEMENT ---
  getLedger: (userId: string): GlobalLedger => {
    const data = localStorage.getItem(`${LEDGER_PREFIX}${userId}`);
    return data ? JSON.parse(data) : {};
  },

  saveLedger: (userId: string, ledger: GlobalLedger) => {
    localStorage.setItem(`${LEDGER_PREFIX}${userId}`, JSON.stringify(ledger));
  }
};
