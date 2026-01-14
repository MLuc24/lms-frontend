import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'expo-router';
import type { LogoutRequestDto, LogoutResponseDto } from '@/types';
import { deactivatePushToken } from '@/features/notifications/services/notification.service';

/**
 * Hook for user logout
 */
export function useLogout(): UseMutationResult<LogoutResponseDto, Error, void> {
  const router = useRouter();
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
      try {
        await deactivatePushToken();
      } catch (error) {
        console.log('Failed to deactivate push token:', error);
      }
      return authService.logout({ refreshToken });
    },
    onSuccess: async () => {
      // Clear auth state and storage
      await clearAuth();
      // Navigate to login screen
      router.replace('/(auth)/login');
    },
    onError: async (error) => {
      console.error('Logout failed:', error);
      // Clear auth anyway on error
      await clearAuth();
      // Navigate to login screen even on error
      router.replace('/(auth)/login');
    },
  });
}
