import { ENV } from '@/config/env';
import { tokenStorage } from '@/shared/utils/tokenStorage';
import type { RefreshTokenResponseDto } from '@/types';

// Unified response type from backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
  } | null;
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.baseUrl = ENV.API_URL;
  }

  /**
   * Subscribe to token refresh completion
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers when token is refreshed
   */
  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Refresh the access token
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result: ApiResponse<RefreshTokenResponseDto> = await response.json();

      if (!response.ok || !result.success || !result.data) {
        // Refresh token is invalid, clear auth
        await tokenStorage.clearAll();
        return null;
      }

      const { accessToken, refreshToken: newRefreshToken } = result.data;
      
      // Save both new tokens (token rotation)
      await tokenStorage.setAccessToken(accessToken);
      await tokenStorage.setRefreshToken(newRefreshToken);
      
      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await tokenStorage.clearAll();
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options?: RequestInit & { skipAuth?: boolean },
    retry = true
  ): Promise<T> {
    // Ensure endpoint starts with / for proper URL construction
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;
    
    try {
      // Get access token if available (unless skipAuth is true)
      const accessToken = options?.skipAuth ? null : await tokenStorage.getAccessToken();
      
      const headers = new Headers(options?.headers);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      // Add Authorization header if token exists
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token (only if not skipAuth)
      if (response.status === 401 && retry && !options?.skipAuth) {
        // If already refreshing, wait for it
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh(async (token: string) => {
              try {
                const result = await this.request<T>(endpoint, options, false);
                resolve(result);
              } catch (err) {
                reject(err);
              }
            });
          });
        }

        // Start refreshing
        this.isRefreshing = true;
        const newAccessToken = await this.refreshAccessToken();
        this.isRefreshing = false;

        if (newAccessToken) {
          // Notify subscribers
          this.onTokenRefreshed(newAccessToken);
          // Retry the original request with new token
          return this.request<T>(endpoint, options, false);
        } else {
          // Refresh failed, redirect to login
          // Note: Navigation logic should be handled by the app
          throw new Error('Session expired. Please login again.');
        }
      }

      const result: ApiResponse<T> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || `API Error: ${response.statusText}`
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  get<T>(endpoint: string, options?: RequestInit & { skipAuth?: boolean }): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  post<T>(endpoint: string, data: any, skipAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth,
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload file (multipart/form-data)
   * Supports both web File/Blob and React Native file objects
   */
  async upload<T>(
    endpoint: string,
    file: File | Blob | { uri: string; name: string; type: string },
    fieldName = 'file',
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();

    // Handle React Native file object vs web File/Blob
    if ('uri' in file) {
      // React Native file object
      formData.append(fieldName, file as any);
    } else {
      // Web File or Blob
      formData.append(fieldName, file);
    }

    // Add additional form fields if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      // Ensure endpoint starts with / for proper URL construction
      const normalizedEndpoint = endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;
      const url = `${this.baseUrl}${normalizedEndpoint}`;
      
      // Debug log
      const accessToken = await tokenStorage.getAccessToken();

      const headers = new Headers();
      // Don't set Content-Type for FormData, browser/RN will set it with boundary
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || `Upload failed: ${response.statusText}`
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('File upload failed');
    }
  }
}

export const apiClient = new ApiClient();
