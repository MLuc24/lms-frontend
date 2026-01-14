import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { ResetPasswordRequestDto, ResetPasswordResponseDto } from '@/types';

/**
 * Hook for resetting password with OTP code
 */
export function useResetPassword(): UseMutationResult<
  ResetPasswordResponseDto,
  Error,
  ResetPasswordRequestDto
> {
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      // Password reset successful
    },
    onError: (error) => {
      // Error will be handled by the component
      console.error('Password reset failed:', error.message || error);
    },
  });
}
