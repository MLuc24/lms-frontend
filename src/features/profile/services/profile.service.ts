/**
 * Profile Service
 * Handles user profile related API calls
 */

import { apiClient } from '@/api/client';
import type { UserResponseDto } from '@/types';

export interface MediaUploadResponse {
  assetId: string;
  fileUrl: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
}

class ProfileService {
  /**
   * Get current user profile
   * GET /users/me
   */
  async getProfile(): Promise<UserResponseDto> {
    return apiClient.get<UserResponseDto>('/users/me');
  }

  /**
   * Upload user avatar
   * POST /users/me/avatar
   */
  async uploadAvatar(file: File | Blob | { uri: string; name: string; type: string }): Promise<MediaUploadResponse> {
    return apiClient.upload<MediaUploadResponse>(
      '/users/me/avatar',
      file,
      'file'
    );
  }

  /**
   * Upload media file (generic)
   * POST /media/upload
   */
  async uploadMedia(
    file: File | Blob | { uri: string; name: string; type: string },
    category?: string,
    filename?: string
  ): Promise<MediaUploadResponse> {
    const additionalData: Record<string, string> = {};
    
    if (category) {
      additionalData.category = category;
    }
    
    if (filename) {
      additionalData.filename = filename;
    }

    return apiClient.upload<MediaUploadResponse>(
      '/media/upload',
      file,
      'file',
      additionalData
    );
  }
}

export const profileService = new ProfileService();
