/**
 * Exercise Service
 * Handles all exercise-related API calls for practice sessions
 */

import { apiClient } from '@/api/client';
import type {
  ExerciseResponseDto,
  ExerciseDetailResponseDto,
  ExerciseListResponseDto,
  SessionResponseDto,
  AttemptResponseDto,
  StartSessionRequestDto,
  SubmitAnswerRequestDto,
  SubmitAnswerResponseDto,
  SubmitAttemptRequestDto,
  AttemptResultResponseDto,
  CompleteSessionResponseDto,
} from '@/types';

export const exerciseService = {
  // ============ EXERCISE ENDPOINTS ============

  /**
   * Get exercises for a lesson
   * GET /lessons/:lessonId/exercises
   */
  async getExercisesByLesson(lessonId: string): Promise<ExerciseListResponseDto> {
    return apiClient.get<ExerciseListResponseDto>(
      `/lessons/${lessonId}/exercises`,
    );
  },

  /**
   * Get exercise detail with prompt and items
   * GET /exercises/:exerciseId
   */
  async getExerciseDetail(exerciseId: string): Promise<ExerciseDetailResponseDto> {
    return apiClient.get<ExerciseDetailResponseDto>(
      `/exercises/${exerciseId}`,
    );
  },

  // ============ SESSION ENDPOINTS ============

  /**
   * Start a practice session for a lesson
   * POST /lessons/:lessonId/sessions
   */
  async startSession(
    lessonId: string,
    data: StartSessionRequestDto,
  ): Promise<SessionResponseDto> {
    return apiClient.post<SessionResponseDto>(
      `/lessons/${lessonId}/sessions`,
      data,
    );
  },

  /**
   * Complete/end a session
   * POST /sessions/:sessionId/complete
   */
  async completeSession(sessionId: string): Promise<CompleteSessionResponseDto> {
    return apiClient.post<CompleteSessionResponseDto>(
      `/sessions/${sessionId}/complete`,
      {},
    );
  },

  // ============ ATTEMPT ENDPOINTS ============

  /**
   * Start a new attempt for an exercise
   * POST /sessions/:sessionId/attempts
   */
  async startAttempt(
    sessionId: string,
    exerciseId: string,
  ): Promise<AttemptResponseDto> {
    return apiClient.post<AttemptResponseDto>(
      `/sessions/${sessionId}/attempts`,
      { exerciseId },
    );
  },

  /**
   * Submit answer for a single item
   * POST /attempts/:attemptId/submit-answer
   */
  async submitAnswer(
    attemptId: string,
    data: SubmitAnswerRequestDto,
  ): Promise<SubmitAnswerResponseDto> {
    return apiClient.post<SubmitAnswerResponseDto>(
      `/attempts/${attemptId}/submit-answer`,
      data,
    );
  },

  /**
   * Submit all answers and complete attempt
   * POST /attempts/:attemptId/submit
   */
  async submitAttempt(
    attemptId: string,
    data: SubmitAttemptRequestDto,
  ): Promise<AttemptResultResponseDto> {
    return apiClient.post<AttemptResultResponseDto>(
      `/attempts/${attemptId}/submit`,
      data,
    );
  },
};
