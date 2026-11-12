import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { clearUserProfile, getUserProfile, saveUserProfile } from '../db';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const db = useSQLiteContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await getUserProfile(db);
      setProfile(user);
      return user;
    } catch (err) {
      console.error('Failed to load child profile from SQLite:', err);
      setError(err?.message || 'Failed to load profile.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const saveProfile = useCallback(
    async ({ name, age, gender, avatarEmoji }) => {
      try {
        setError(null);
        const updated = await saveUserProfile(db, { name, age, gender, avatarEmoji });
        setProfile(updated);
        return updated;
      } catch (err) {
        setError(err?.message || 'Failed to save profile.');
        throw err;
      }
    },
    [db]
  );

  const clearProfile = useCallback(async () => {
    try {
      setError(null);
      await clearUserProfile(db);
      setProfile(null);
    } catch (err) {
      setError(err?.message || 'Failed to reset profile.');
      throw err;
    }
  }, [db]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        saveProfile,
        clearProfile,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a <ProfileProvider>');
  }
  return context;
}
