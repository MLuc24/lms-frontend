/**
 * Dashboard data hooks
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService, ProgressTodayParams, ProgressWeeklyParams, ReviewQueueParams } from '../services/dashboard.service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  progressToday: (date?: string) => [...dashboardKeys.all, 'progress', 'today', date] as const,
  progressWeekly: (weekStart?: string) => [...dashboardKeys.all, 'progress', 'weekly', weekStart] as const,
  streak: () => [...dashboardKeys.all, 'streak'] as const,
  reviewSummary: () => [...dashboardKeys.all, 'review', 'summary'] as const,
  reviewQueue: (params?: ReviewQueueParams) =>
    [...dashboardKeys.all, 'review', 'queue', params?.page, params?.limit, params?.dueBefore] as const,
};

export function useProgressToday(params?: ProgressTodayParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.progressToday(params?.date),
    queryFn: () => dashboardService.getProgressToday(params),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useProgressWeekly(params?: ProgressWeeklyParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.progressWeekly(params?.weekStart),
    queryFn: () => dashboardService.getProgressWeekly(params),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStreak(timeZone?: string, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.streak(),
    queryFn: () => dashboardService.getStreak(timeZone),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

export function useReviewSummary(timeZone?: string, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.reviewSummary(),
    queryFn: () => dashboardService.getReviewSummary(timeZone),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

export function useReviewQueue(params?: ReviewQueueParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.reviewQueue(params),
    queryFn: () => dashboardService.getReviewQueue(params),
    enabled,
    staleTime: 30 * 1000,
  });
}
