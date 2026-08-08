import type { UserProfile, GlobalLedger, ExportedUserData } from '../types';
import { INITIAL_LEDGER } from '../config';

const USERS_KEY = 'os_finance_users';
const LEDGER_PREFIX = 'os_finance_ledger_';

const isValidExport = (payload: unknown): payload is ExportedUserData => {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  const profile = p.profile as Record<string, unknown> | undefined;
  return (
    typeof profile === 'object' &&
    profile !== null &&
    typeof profile.id === 'string' &&
    typeof profile.name === 'string' &&
    typeof profile.pinHash === 'string' &&
    typeof p.ledger === 'object' &&
    p.ledger !== null
  );
};

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

    // If it's a new user, initialize their ledger. Demo starter data is dev-only convenience;
    // production/Android builds always give new accounts a genuinely empty ledger.
    if (!localStorage.getItem(`${LEDGER_PREFIX}${user.id}`)) {
      db.saveLedger(user.id, import.meta.env.DEV ? INITIAL_LEDGER : {});
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
  },

  // --- BACKUP / RESTORE ---
  exportUser: (userId: string): ExportedUserData => {
    const users = db.getUsers();
    const profile = users[userId];
    if (!profile) throw new Error(`No user found with id ${userId}`);
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      ledger: db.getLedger(userId)
    };
  },

  importUser: (payload: unknown): UserProfile => {
    if (!isValidExport(payload)) throw new Error('Invalid or corrupted backup file.');
    const { profile, ledger } = payload;
    const users = db.getUsers();
    users[profile.id] = profile;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    db.saveLedger(profile.id, ledger);
    return profile;
  }
};
