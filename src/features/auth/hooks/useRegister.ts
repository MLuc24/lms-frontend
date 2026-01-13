import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterRequestDto, RegisterResponseDto } from '@/types';

/**
 * Hook for user registration
 */
export function useRegister(): UseMutationResult<RegisterResponseDto, Error, RegisterRequestDto> {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      // Note: Backend returns user but NOT tokens on registration
      // User needs to verify email and then login
      // So we don't set auth here, just show success message
      console.log('Registration successful:', data.message);
    },
    onError: (error) => {
      // Log only to terminal, not console.error to avoid Expo toast
      console.log('Registration failed:', error.message || error);
    },
  });
}
