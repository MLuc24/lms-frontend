import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useShallow } from 'zustand/react/shallow';
import type { LogoutRequestDto, LogoutResponseDto } from '@/types';

/**
 * Hook for user logout
 */
export function useLogout(): UseMutationResult<LogoutResponseDto, Error, void> {
  const { refreshToken, clearAuth } = useAuthStore(
    useShallow((state) => ({
      refreshToken: state.refreshToken,
      clearAuth: state.clearAuth,
    }))
  );

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      return authService.logout({ refreshToken });
    },
    onSuccess: async () => {
      // Clear auth state and storage
      await clearAuth();
    },
    onError: async (error) => {
      console.error('Logout failed:', error);
      // Clear auth anyway on error
      await clearAuth();
    },
  });
}
