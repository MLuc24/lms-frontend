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
      // Ensure tokens are strings
      const accessToken = typeof data.accessToken === 'string' 
        ? data.accessToken 
        : String(data.accessToken);
      const refreshToken = typeof data.refreshToken === 'string'
        ? data.refreshToken
        : String(data.refreshToken);

      // Save auth data to store and secure storage
      await setAuth({
        user: data.user,
        accessToken,
        refreshToken,
      });
    },
    onError: (error) => {
      // Error will be handled by the component
      console.error('Login failed:', error.message || error);
    },
  });
}
