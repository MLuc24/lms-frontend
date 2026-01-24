/**
 * useHomeDashboard Hook
 * Manages home dashboard data and operations
 */

import { useState, useCallback } from 'react';
import { homeService } from '../services/home.service';
import { dashboardService } from '@/features/dashboard/services/dashboard.service';
import {
  getNotificationSummary,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/features/notifications/services/notification.service';
import type { HomeSummaryResponseDto } from '@/types';

export const useHomeDashboard = () => {
  const [data, setData] = useState<HomeSummaryResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch complete dashboard summary
   */
  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await homeService.getSummary();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh dashboard data
   */
  const refresh = useCallback(async () => {
    return fetchSummary();
  }, [fetchSummary]);

  return {
    data,
    loading,
    error,
    fetchSummary,
    refresh,
  };
};

/**
 * useProgress Hook
 * Manages progress data
 */
export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToday = useCallback(async (date?: string) => {
    try {
      setLoading(true);
      setError(null);
      return await dashboardService.getProgressToday({ date });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch progress';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeekly = useCallback(async (weekStart?: string) => {
    try {
      setLoading(true);
      setError(null);
      return await dashboardService.getProgressWeekly({ weekStart });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weekly progress';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStreak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await dashboardService.getStreak();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch streak';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchToday,
    fetchWeekly,
    fetchStreak,
  };
};

/**
 * useReview Hook
 * Manages review operations
 */
export const useReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await dashboardService.getReviewSummary();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch review summary';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQueue = useCallback(async (params?: {
    page?: number;
    limit?: number;
    dueBefore?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      return await dashboardService.getReviewQueue(params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch review queue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (
    itemId: string,
    isCorrect: boolean,
    userAnswer?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      return await dashboardService.submitReview(itemId, isCorrect, userAnswer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit review';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchSummary,
    fetchQueue,
    submitReview,
  };
};

/**
 * useNotification Hook
 * Manages notification operations
 */
export const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await getNotificationSummary();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await markNotificationRead(notificationId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await markAllNotificationsRead();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchSummary,
    markAsRead,
    markAllAsRead,
  };
};
