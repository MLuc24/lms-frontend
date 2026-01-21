/**
 * useNotificationSummary Hook
 * Fetches notification badge counts
 */

import { useQuery } from '@tanstack/react-query';
import { getNotificationSummary } from '../services/notification.service';

export const notificationKeys = {
  all: ['notifications'] as const,
  summary: () => [...notificationKeys.all, 'summary'] as const,
};

export function useNotificationSummary(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.summary(),
    queryFn: () => getNotificationSummary(),
    enabled,
    staleTime: 60 * 1000,
  });
}
