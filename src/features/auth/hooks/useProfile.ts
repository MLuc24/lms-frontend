import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useShallow } from 'zustand/react/shallow';
import type { UserResponseDto } from '@/types';

/**
 * Hook for fetching user profile
 */
export function useProfile(): UseQueryResult<UserResponseDto, Error> {
  const { isAuthenticated, setUser } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      setUser: state.setUser,
    }))
  );

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: async (data) => {
      // Update user in store if data changed
      await setUser(data);
    },
    onError: (error) => {
      console.error('Failed to fetch profile:', error);
    },
  });
}
