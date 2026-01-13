import { apiClient } from '@/api/client';
import type {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
  LogoutRequestDto,
  LogoutResponseDto,
  UserResponseDto,
} from '@/types';

/**
 * Auth Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Register new user
   * POST /auth/register
   */
  async register(data: RegisterRequestDto): Promise<RegisterResponseDto> {
    return apiClient.post<RegisterResponseDto>('/auth/register', data, true);
  },

  /**
   * Login user
   * POST /auth/login
   */
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return apiClient.post<LoginResponseDto>('/auth/login', data, true);
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(data: LogoutRequestDto): Promise<LogoutResponseDto> {
    return apiClient.post<LogoutResponseDto>('/auth/logout', data);
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  async refreshToken(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return apiClient.post<RefreshTokenResponseDto>('/auth/refresh-token', data);
  },

  /**
   * Request password reset (sends OTP to email)
   * POST /auth/forgot-password
   */
  async forgotPassword(data: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    return apiClient.post<ForgotPasswordResponseDto>('/auth/forgot-password', data);
  },

  /**
   * Reset password using OTP
   * POST /auth/reset-password
   */
  async resetPassword(data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    return apiClient.post<ResetPasswordResponseDto>('/auth/reset-password', data);
  },

  /**
   * Change password (requires current password)
   * POST /auth/change-password
   */
  async changePassword(data: ChangePasswordRequestDto): Promise<ChangePasswordResponseDto> {
    return apiClient.post<ChangePasswordResponseDto>('/auth/change-password', data);
  },

  /**
   * Get current user profile
   * GET /auth/profile
   */
  async getProfile(): Promise<UserResponseDto> {
    return apiClient.get<UserResponseDto>('/auth/profile');
  },

  /**
   * Verify email (handled via web browser, not mobile app)
   * GET /auth/verify-email?token=xxx
   * Note: This endpoint returns HTML, not JSON
   */
  verifyEmail(token: string): string {
    // Return the verification URL for deep linking or web view
    return `/auth/verify-email?token=${token}`;
  },
};
