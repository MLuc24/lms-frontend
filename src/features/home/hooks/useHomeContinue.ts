/**
 * useHomeContinue Hook
 * Fetches continue learning card data
 */

import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home.service';
import { homeKeys } from './useHomeSummary';

export function useHomeContinue(enabled = true) {
  return useQuery({
    queryKey: homeKeys.continue(),
    queryFn: () => homeService.getContinue(),
    enabled,
    staleTime: 60 * 1000,
  });
}
