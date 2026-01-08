import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { LoginRequestDto, LoginResponseDto } from '@/types';

/**
 * Hook for user login
 */
export function useLogin(): UseMutationResult<LoginResponseDto, Error, LoginRequestDto> {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Save auth data to store and secure storage
      await setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}
