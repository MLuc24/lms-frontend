import * as SecureStore from 'expo-secure-store';

/**
 * Token Storage Keys
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
} as const;

/**
 * Token Storage Utility
 * Uses Expo SecureStore for secure token persistence
 */
export const tokenStorage = {
  /**
   * Save access token
   */
  async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Remove access token
   */
  async removeAccessToken(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Save refresh token
   */
  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Remove refresh token
   */
  async removeRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Save user data (stringified JSON)
   */
  async setUser(user: Record<string, any>): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Get user data
   */
  async getUser<T>(): Promise<T | null> {
    const userJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Remove user data
   */
  async removeUser(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
  },

  /**
   * Clear all auth data
   */
  async clearAll(): Promise<void> {
    await Promise.all([
      this.removeAccessToken(),
      this.removeRefreshToken(),
      this.removeUser(),
    ]);
  },

  /**
   * Save complete auth session
   */
  async saveAuthSession(data: {
    accessToken: string;
    refreshToken: string;
    user: Record<string, any>;
  }): Promise<void> {
    await Promise.all([
      this.setAccessToken(data.accessToken),
      this.setRefreshToken(data.refreshToken),
      this.setUser(data.user),
    ]);
  },

  /**
   * Get complete auth session
   */
  async getAuthSession<T>(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    user: T | null;
  }> {
    const [accessToken, refreshToken, user] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
      this.getUser<T>(),
    ]);

    return { accessToken, refreshToken, user };
  },
};
