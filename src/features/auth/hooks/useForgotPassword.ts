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
      // Password reset email sent
    },
    onError: (error) => {
      // Error will be handled by the component
      console.error('Forgot password failed:', error.message || error);
    },
  });
}
