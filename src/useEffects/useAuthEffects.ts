import { useEffect } from 'react';
import { db } from '../storage/database';
import type { UserProfile } from '../types';

/**
 * Loads all registered user profiles from storage on mount.
 */
export function useLoadUsersEffect(
  setUsers: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>
) {
  useEffect(() => {
    setUsers(db.getUsers());
  }, [setUsers]);
}
