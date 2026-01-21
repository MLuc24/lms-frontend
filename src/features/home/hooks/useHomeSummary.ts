/**
 * useHomeSummary Hook
 * Fetches dashboard summary data
 */

import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home.service';

export const homeKeys = {
  all: ['home'] as const,
  summary: () => [...homeKeys.all, 'summary'] as const,
  continue: () => [...homeKeys.all, 'continue'] as const,
};

export function useHomeSummary(enabled = true) {
  return useQuery({
    queryKey: homeKeys.summary(),
    queryFn: () => homeService.getSummary(),
    enabled,
    staleTime: 60 * 1000,
  });
}
