import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { ChangePasswordRequestDto, ChangePasswordResponseDto } from '@/types';

/**
 * Hook for changing password (requires current password)
 */
export function useChangePassword(): UseMutationResult<
  ChangePasswordResponseDto,
  Error,
  ChangePasswordRequestDto
> {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      // Password changed successfully
    },
    onError: (error) => {
      console.error('Password change failed:', error);
    },
  });
}
