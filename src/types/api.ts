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

// ==================== HOME / DASHBOARD DTOs ====================

export interface HomeUserDto {
  userId: string;
  displayName: string;
  avatarUrl?: string;
}

export interface ContinueLearningDto {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonOrder: number;
  lessonTitle: string;
  lessonEstimatedMinutes?: number;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  remainingMinutes: number;
}

export interface DailyGoalDto {
  targetMinutes: number;
  learnedMinutes: number;
  progressPercent: number;
}

export interface StreakSummaryDto {
  currentDays: number;
  longestDays: number;
  freezeCount: number;
}

export interface HomeReviewSummaryDto {
  dueCount: number;
}

export interface NotificationSummaryDto {
  unreadCount: number;
}

export interface HomeSummaryResponseDto {
  user: HomeUserDto;
  continueLearning: ContinueLearningDto | null;
  dailyGoal: DailyGoalDto;
  streak: StreakSummaryDto;
  review: HomeReviewSummaryDto;
  notifications: NotificationSummaryDto;
}

export interface HomeContinueResponseDto {
  continueLearning: ContinueLearningDto | null;
}

export interface ProgressGoalDto {
  targetMinutes: number;
  progressPercent: number;
  achieved: boolean;
}

export interface ProgressTodayResponseDto {
  date: string;
  minutesLearned: number;
  xpEarned: number;
  lessonsCompleted: number;
  streakDays: number;
  goal: ProgressGoalDto;
}

export interface ProgressWeeklyDayDto {
  date: string;
  minutes: number;
  xp: number;
  lessonsCompleted: number;
  goalMet: boolean;
}

export interface ProgressWeeklyResponseDto {
  weekStart: string;
  weekEnd: string;
  days: ProgressWeeklyDayDto[];
}

export interface ReviewSummaryResponseDto {
  dueCount: number;
  overdueCount: number;
  dueTodayCount: number;
  nextDueAt?: string;
}

export interface ReviewQueueItemDto {
  reviewQueueId: string;
  itemId: string;
  dueAt: string;
  priority: number;
  source: string;
}

export interface ReviewQueueResponseDto {
  items: ReviewQueueItemDto[];
  total: number;
  page: number;
  limit: number;
}

export interface StreakDayDto {
  date: string;
  status: 'done' | 'today' | 'missed' | 'future' | 'frozen';
}

export interface StreakWeekDto {
  startDate: string;
  endDate: string;
  days: StreakDayDto[];
}

export interface StreakResponseDto {
  currentDays: number;
  longestDays: number;
  freezeCount: number;
  lastActivityDate: string | null;
  week: StreakWeekDto;
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

// ==================== PRACTICE SESSION DTOs (NEW) ====================

export interface StartPracticeSessionRequestDto {
  mode: 'learn' | 'review' | 'test';
}

export interface StartPracticeSessionResponseDto {
  sessionId: string;
  lessonId: string;
  mode: 'learn' | 'review' | 'test';
  startedAt: string;
}

export interface EndPracticeSessionResponseDto {
  sessionId: string;
  endedAt: string;
  durationMinutes: number;
}

// ==================== REVIEW DTOs (NEW) ====================

export interface SubmitReviewRequestDto {
  itemId: string;
  isCorrect: boolean;
  userAnswer?: string;
}

export interface SubmitReviewResponseDto {
  success: boolean;
  itemId: string;
  nextReviewAt: string;
  newStage: number;
  intervalDays: number;
}

// ==================== NOTIFICATION DTOs (NEW) ====================

export interface MarkNotificationReadResponseDto {
  success: boolean;
  notificationId: string;
  readAt: string;
}

export interface MarkAllNotificationsReadResponseDto {
  success: boolean;
  markedCount: number;
}
