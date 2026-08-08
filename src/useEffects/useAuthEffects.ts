import { useEffect } from 'react';
import { db } from '../storage/database';
import type { UserProfile } from '../types';

/**
 * Loads all registered user profiles from storage on mount, and flags once that
 * initial load has completed (so callers can distinguish "no users yet" from "not loaded yet").
 */
export function useLoadUsersEffect(
  setUsers: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>,
  setUsersLoaded?: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    setUsers(db.getUsers());
    setUsersLoaded?.(true);
  }, [setUsers, setUsersLoaded]);
}
