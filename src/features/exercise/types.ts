/**
 * Exercise Type Definitions for Feature Module
 */

import type { SessionMode, ExerciseType, ExerciseItemType } from '@/types';

// Local state types for exercise session
export interface ExerciseSessionState {
  sessionId: string | null;
  lessonId: string;
  mode: SessionMode;
  currentExerciseIndex: number;
  exercises: ExerciseWithProgress[];
  totalScore: number;
  maxScore: number;
  isCompleted: boolean;
  startedAt: Date;
}

export interface ExerciseWithProgress {
  exerciseId: string;
  exerciseType: ExerciseType;
  difficulty: number;
  points: number;
  timeLimitSeconds?: number;
  attemptId?: string;
  isCompleted: boolean;
  isCorrect?: boolean;
  scoreAwarded?: number;
}

// User answer tracking
export interface UserAnswer {
  exerciseItemId: string;
  selectedOptionId?: string;
  submittedText?: string;
  timeSpentSeconds: number;
}

// Exercise component props base
export interface ExerciseBaseProps {
  exerciseId: string;
  onAnswer: (answer: UserAnswer) => void;
  onComplete: () => void;
  disabled?: boolean;
  showFeedback?: boolean;
}

// MCQ specific props
export interface MCQExerciseProps extends ExerciseBaseProps {
  question: string;
  questionAssetUrl?: string;
  options: MCQOption[];
  correctOptionId?: string;
  selectedOptionId?: string;
}

export interface MCQOption {
  optionId: string;
  text: string;
  assetUrl?: string;
}

// Fill blank specific props
export interface FillBlankExerciseProps extends ExerciseBaseProps {
  sentence: string;
  blanks: BlankItem[];
  userInputs?: Record<string, string>;
}

export interface BlankItem {
  itemId: string;
  position: number;
  correctAnswer?: string;
}

// Matching specific props
export interface MatchingExerciseProps extends ExerciseBaseProps {
  pairs: MatchingPair[];
  userMatches?: Record<string, string>;
}

export interface MatchingPair {
  leftId: string;
  leftText: string;
  rightId: string;
  rightText: string;
}

// Session result
export interface SessionResultData {
  totalScore: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  totalCount: number;
  timeSpent: number;
  streakBonus?: number;
}
