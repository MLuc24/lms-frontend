import { create } from 'zustand';
import type { UserResponseDto } from '@/types';
import { tokenStorage } from '@/shared/utils/tokenStorage';

interface AuthState {
  // State
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (data: {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  setUser: (user: UserResponseDto) => Promise<void>;
  clearAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Set authentication data (after login or register)
   */
  setAuth: async (data) => {
    const { user, accessToken, refreshToken } = data;

    // Save to secure storage
    await tokenStorage.saveAuthSession({
      accessToken,
      refreshToken,
      user,
    });

    // Update state
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * Update user data only
   */
  setUser: async (user) => {
    await tokenStorage.setUser(user);
    set({ user });
  },

  /**
   * Clear authentication (logout)
   */
  clearAuth: async () => {
    await tokenStorage.clearAll();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  /**
   * Set loading state
   */
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  /**
   * Initialize auth from storage (on app start)
   */
  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      const session = await tokenStorage.getAuthSession<UserResponseDto>();

      if (session.accessToken && session.refreshToken && session.user) {
        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
