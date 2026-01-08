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
      console.log('Password reset successful:', data.message);
    },
    onError: (error) => {
      console.error('Password reset failed:', error);
    },
  });
}
