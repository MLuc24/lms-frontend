/**
 * useProfile Hook
 * React Query hook for fetching user profile
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import type { UserResponseDto } from '@/types';

export function useProfile(): UseQueryResult<UserResponseDto, Error> {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
