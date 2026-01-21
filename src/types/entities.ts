import {
  UserStatus,
  LessonType,
  SkillType,
  EnrollmentStatus,
} from './enums';

// ============ USER ENTITIES ============

export interface User {
  userId: string;
  email?: string;
  phone?: string;
  displayName: string;
  avatarAssetId?: string;
  status: UserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
}

// ============ LOCALIZATION INTERFACES ============

export interface CourseLocalization {
  languageId: number;
  title: string;
  description?: string;
}

export interface UnitLocalization {
  languageId: number;
  title: string;
  description?: string;
}

export interface SkillLocalization {
  languageId: number;
  title: string;
  description?: string;
}

export interface LessonLocalization {
  languageId: number;
  title: string;
  introText?: string;
}

// ============ COURSE ENTITIES ============

export interface Course {
  courseId: string;
  courseCode: string;
  targetLanguageId: number;
  baseLanguageId: number;
  levelId: number;
  isPublished: boolean;
  localizations: CourseLocalization[];
  // Localized fields (populated based on languageId query)
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseVersion {
  courseVersionId: string;
  courseId: string;
  versionNumber: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
}

export interface Unit {
  unitId: string;
  courseVersionId: string;
  orderIndex: number;
  localizations: UnitLocalization[];
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Populated relations
  skills?: Skill[];
}

export interface Skill {
  skillId: string;
  unitId: string;
  skillType: SkillType;
  orderIndex: number;
  localizations: SkillLocalization[];
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Populated relations
  lessons?: Lesson[];
}

export interface Lesson {
  lessonId: string;
  skillId: string;
  lessonType: LessonType;
  orderIndex: number;
  estimatedMinutes?: number;
  isPublished: boolean;
  localizations: LessonLocalization[];
  title?: string;
  introText?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ ENROLLMENT & PROGRESS ENTITIES ============

export interface Enrollment {
  enrollmentId: string;
  userId: string;
  courseId: string;
  courseVersionId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface LessonProgress {
  lessonProgressId: string;
  enrollmentId: string;
  lessonId: string;
  bestScore: number;
  lastScore: number;
  completedAt?: Date;
  attemptsCount: number;
}

export interface CourseProgress {
  enrollmentId: string;
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessonProgress: LessonProgress[];
}

export interface SkillMastery {
  skillId: string;
  masteryLevel: number;
  lastPracticedAt?: Date;
}

// ============ EXERCISE ENTITIES ============

import { ExerciseType, ExerciseItemType, SessionMode } from './enums';

export interface ExerciseOption {
  optionId: string;
  optionText: string;
  optionAssetUrl?: string;
}

export interface ExerciseItem {
  exerciseItemId: string;
  itemOrder: number;
  itemType: ExerciseItemType;
  options?: ExerciseOption[];
}

export interface ExercisePrompt {
  promptText: string;
  promptAssetUrl?: string;
}

export interface Exercise {
  exerciseId: string;
  lessonId: string;
  exerciseType: ExerciseType;
  difficulty: number;
  points: number;
  timeLimitSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseDetail extends Exercise {
  prompt?: ExercisePrompt;
  items: ExerciseItem[];
}

// ============ PRACTICE SESSION ENTITIES ============

export interface PracticeSession {
  sessionId: string;
  lessonId: string;
  mode: SessionMode;
  startedAt: Date;
  endedAt?: Date;
}

export interface Attempt {
  attemptId: string;
  attemptNumber: number;
}

export interface SubmitAnswerResult {
  isCorrect: boolean;
  scoreAwarded: number;
  correctAnswer?: string;
  explanation?: string;
}

export interface ResponseResult {
  exerciseItemId: string;
  isCorrect: boolean;
  scoreAwarded: number;
  correctAnswer?: string;
}

export interface AttemptResult {
  attemptId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  details: ResponseResult[];
}

export interface CompleteSessionResult {
  sessionId: string;
  lessonId: string;
  endedAt: Date;
  bestScore: number;
  totalAttempts: number;
}