/**
 * Media utilities for handling file URLs
 */

import Constants from 'expo-constants';

/**
 * Get the base API URL from environment
 */
function getApiBaseUrl(): string {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URL is not configured');
  }
  // Remove /api/v1 suffix to get base URL
  return apiUrl.replace(/\/api\/v\d+$/, '');
}

/**
 * Convert a relative file path to a full URL
 * @param path - Relative path from backend (e.g., "lms-files/avatars/123.jpg")
 * @returns Full URL (e.g., "http://192.168.1.7:3000/lms-files/avatars/123.jpg")
 */
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Build full URL
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(path: string | undefined | null): string | undefined {
  return getMediaUrl(path);
}

/**
 * Get course cover URL with fallback
 */
export function getCoverUrl(path: string | undefined | null): string | undefined {
  return getMediaUrl(path);
}
