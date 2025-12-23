import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  DAILY_GOAL: '@fnb_tycoon:daily_goal',
  REMINDER_TIME: '@fnb_tycoon:reminder_time',
  REMINDER_ENABLED: '@fnb_tycoon:reminder_enabled',
};

export interface LearningStats {
  totalLessonsCompleted: number;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // in minutes
  averageScore: number;
  lessonsThisWeek: number;
  perfectLessons: number;
}

interface SettingsContextType {
  // Daily Goal
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;

  // Reminder
  reminderTime: { hour: number; minute: number };
  setReminderTime: (time: { hour: number; minute: number }) => void;
  reminderEnabled: boolean;
  setReminderEnabled: (enabled: boolean) => void;

  // Stats (mock data for now)
  learningStats: LearningStats;

  // Loading state
  isLoading: boolean;
}

const defaultStats: LearningStats = {
  totalLessonsCompleted: 24,
  totalXpEarned: 1250,
  currentStreak: 5,
  longestStreak: 12,
  totalTimeSpent: 180,
  averageScore: 85,
  lessonsThisWeek: 8,
  perfectLessons: 6,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyGoal, setDailyGoalState] = useState(5);
  const [reminderTime, setReminderTimeState] = useState({ hour: 9, minute: 0 });
  const [reminderEnabled, setReminderEnabledState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [goalStr, timeStr, enabledStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_GOAL),
          AsyncStorage.getItem(STORAGE_KEYS.REMINDER_TIME),
          AsyncStorage.getItem(STORAGE_KEYS.REMINDER_ENABLED),
        ]);

        if (goalStr) {
          setDailyGoalState(parseInt(goalStr, 10));
        }
        if (timeStr) {
          setReminderTimeState(JSON.parse(timeStr));
        }
        if (enabledStr) {
          setReminderEnabledState(enabledStr === 'true');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const setDailyGoal = useCallback(async (goal: number) => {
    setDailyGoalState(goal);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_GOAL, goal.toString());
    } catch (error) {
      console.error('Failed to save daily goal:', error);
    }
  }, []);

  const setReminderTime = useCallback(async (time: { hour: number; minute: number }) => {
    setReminderTimeState(time);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_TIME, JSON.stringify(time));
    } catch (error) {
      console.error('Failed to save reminder time:', error);
    }
  }, []);

  const setReminderEnabled = useCallback(async (enabled: boolean) => {
    setReminderEnabledState(enabled);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_ENABLED, enabled.toString());
    } catch (error) {
      console.error('Failed to save reminder enabled:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      dailyGoal,
      setDailyGoal,
      reminderTime,
      setReminderTime,
      reminderEnabled,
      setReminderEnabled,
      learningStats: defaultStats,
      isLoading,
    }),
    [dailyGoal, setDailyGoal, reminderTime, setReminderTime, reminderEnabled, setReminderEnabled, isLoading]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
