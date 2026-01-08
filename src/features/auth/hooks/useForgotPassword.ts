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
      console.error('Forgot password failed:', error);
    },
  });
}
