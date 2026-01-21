/**
 * Course Feature Types
 * Feature-specific types and interfaces
 */

import type {
  CourseResponseDto,
  EnrollmentResponseDto,
  CourseProgressResponseDto,
} from '@/types';

// Extended course with enrollment info
export interface CourseWithEnrollment extends CourseResponseDto {
  enrollment?: EnrollmentResponseDto;
  progress?: CourseProgressResponseDto;
}

// Course filter state
export interface CourseFilters {
  targetLanguageId?: number;
  baseLanguageId?: number;
  levelId?: number;
  search?: string;
}

// Lesson completion state
export interface LessonCompletionState {
  lessonId: string;
  isCompleted: boolean;
  bestScore: number;
  attemptsCount: number;
}

// Skill progress state
export interface SkillProgressState {
  skillId: string;
  totalLessons: number;
  completedLessons: number;
  masteryLevel: number;
}

// Unit progress state
export interface UnitProgressState {
  unitId: string;
  totalSkills: number;
  completedSkills: number;
  isLocked: boolean;
}

// Learning session state
export interface LearningSession {
  courseId: string;
  currentLessonId?: string;
  currentExerciseIndex: number;
  score: number;
  mistakes: number;
  startedAt: Date;
}
