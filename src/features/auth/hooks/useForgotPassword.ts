import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { ForgotPasswordRequestDto, ForgotPasswordResponseDto } from '@/types';

/**
 * Hook for requesting password reset (forgot password)
 */
export function useForgotPassword(): UseMutationResult<
  ForgotPasswordResponseDto,
  Error,
  ForgotPasswordRequestDto
> {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      console.log('Password reset email sent:', data.message);
    },
    onError: (error) => {
      // Log only to terminal, not console.error to avoid Expo toast
      console.log('Forgot password failed:', error.message || error);
    },
  });
}
