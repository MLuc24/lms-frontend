/**
 * useUploadAvatar Hook
 * React Query mutation for uploading user avatar
 * 
 * NOTE: Không xử lý UI (Alert, Toast) trong hook
 * Component sẽ handle success/error UI
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, type MediaUploadResponse } from '../services/profile.service';

interface UseUploadAvatarOptions {
  onSuccess?: (data: MediaUploadResponse) => void;
  onError?: (error: Error) => void;
}

export function useUploadAvatar(options?: UseUploadAvatarOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File | Blob | { uri: string; name: string; type: string }) => 
      profileService.uploadAvatar(file),
    
    onSuccess: (data) => {
      // Invalidate profile queries to refetch with new avatar
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      
      // Call custom onSuccess callback
      options?.onSuccess?.(data);
    },
    
    onError: (error: Error) => {
      console.error('Failed to upload avatar:', error);
      
      // Call custom onError callback
      options?.onError?.(error);
    },
  });
}
