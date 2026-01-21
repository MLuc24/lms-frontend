// API Response Types

import type {
  CourseLocalization,
  UnitLocalization,
  SkillLocalization,
  LessonLocalization,
} from './entities';
import type { LessonType, SkillType, EnrollmentStatus } from './enums';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

// ==================== AUTH DTOs ====================

// User Response DTO
export interface UserResponseDto {
  userId: string;
  email?: string;
  phone?: string;
  displayName: string;
  avatarAssetId?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'deleted';
  lastLoginAt?: string; // ISO date string
  createdAt: string; // ISO date string
}

// Register
export interface RegisterRequestDto {
  email?: string;
  phone?: string;
  password: string;
  displayName: string;
  // Device info (optional)
  platform?: 'ios' | 'android' | 'web';
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  locale?: string;
}

export interface RegisterResponseDto {
  user: UserResponseDto;
  message: string;
}

// Login
export interface LoginRequestDto {
  email?: string;
  phone?: string;
  password: string;
  // Device info (optional)
  platform?: 'ios' | 'android';
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  locale?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds (900 = 15 minutes)
  user: UserResponseDto;
}

// Refresh Token
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Forgot Password
export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
}

// Check Email
export interface CheckEmailRequestDto {
  email: string;
}

export interface CheckEmailResponseDto {
  exists: boolean;
}

// Reset Password
export interface ResetPasswordRequestDto {
  email: string;
  otpCode: string; // 6 digits
  newPassword: string;
}

export interface ResetPasswordResponseDto {
  message: string;
}

// Change Password
export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  message: string;
}

// Logout
export interface LogoutRequestDto {
  refreshToken: string;
}

export interface LogoutResponseDto {
  message: string;
}

// Push Tokens / Notifications
export interface RegisterPushTokenRequestDto {
  token: string;
  provider: 'apns' | 'fcm';
  platform: 'ios' | 'android';
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  locale?: string;
}

export interface RegisterPushTokenResponseDto {
  message: string;
  deviceId: string;
}

export interface DeactivatePushTokenRequestDto {
  token: string;
}

export interface DeactivatePushTokenResponseDto {
  message: string;
}

export interface SendTestPushResponseDto {
  message: string;
  successCount: number;
  failureCount: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== COURSE DTOs ====================

// Course Response DTOs
export interface CourseResponseDto {
  courseId: string;
  courseCode: string;
  targetLanguageId: number;
  baseLanguageId: number;
  levelId: number;
  isPublished: boolean;
  localizations: CourseLocalization[];
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseListResponseDto {
  data: CourseResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseQueryParams {
  targetLanguageId?: number;
  baseLanguageId?: number;
  levelId?: number;
  isPublished?: boolean;
  search?: string;
  languageId?: number;
  page?: number;
  limit?: number;
}

// Unit Response DTOs
export interface UnitResponseDto {
  unitId: string;
  courseVersionId: string;
  orderIndex: number;
  localizations: UnitLocalization[];
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  skills?: SkillResponseDto[];
}

// Skill Response DTOs
export interface SkillResponseDto {
  skillId: string;
  unitId: string;
  skillType: SkillType;
  orderIndex: number;
  localizations: SkillLocalization[];
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lessons?: LessonResponseDto[];
}

// Lesson Response DTOs
export interface LessonResponseDto {
  lessonId: string;
  skillId: string;
  lessonType: LessonType;
  orderIndex: number;
  estimatedMinutes?: number;
  isPublished: boolean;
  localizations: LessonLocalization[];
  title?: string;
  introText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonListResponseDto {
  data: LessonResponseDto[];
  total: number;
}

// ==================== ENROLLMENT DTOs ====================

export interface EnrollmentResponseDto {
  enrollmentId: string;
  userId: string;
  courseId: string;
  courseVersionId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface EnrollmentListResponseDto {
  data: EnrollmentResponseDto[];
  total: number;
}

// ==================== PROGRESS DTOs ====================

export interface LessonProgressResponseDto {
  lessonProgressId: string;
  enrollmentId: string;
  lessonId: string;
  bestScore: number;
  lastScore: number;
  completedAt?: string;
  attemptsCount: number;
}

export interface CompleteLessonRequestDto {
  score: number;
}

export interface CompleteLessonResponseDto {
  success: boolean;
  lessonProgressId: string;
  bestScore: number;
  attemptsCount: number;
  isFirstCompletion: boolean;
}

export interface CourseProgressResponseDto {
  enrollmentId: string;
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessonProgress: LessonProgressResponseDto[];
}

export interface SkillMasteryResponseDto {
  skillId: string;
  masteryLevel: number;
  lastPracticedAt?: string;
}

// ==================== COURSE DETAIL DTOs ====================

export interface CourseDetailResponseDto extends CourseResponseDto {
  units: UnitResponseDto[];
}
