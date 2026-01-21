/**
 * useSession Hook
 * Manage practice session and attempts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseService } from '../services/exercise.service';
import type {
  StartSessionRequestDto,
  SubmitAnswerRequestDto,
  SubmitAttemptRequestDto,
} from '@/types';
import { exerciseKeys } from './useExercises';

/**
 * Start a new practice session
 */
export function useStartSession(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartSessionRequestDto) =>
      exerciseService.startSession(lessonId, data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: exerciseKeys.sessions() });
    },
  });
}

/**
 * Complete/end a session
 */
export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      exerciseService.completeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseKeys.sessions() });
    },
  });
}

/**
 * Start a new attempt for an exercise
 */
export function useStartAttempt() {
  return useMutation({
    mutationFn: ({
      sessionId,
      exerciseId,
    }: {
      sessionId: string;
      exerciseId: string;
    }) => exerciseService.startAttempt(sessionId, exerciseId),
  });
}

/**
 * Submit answer for a single item (real-time feedback)
 */
export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      attemptId,
      data,
    }: {
      attemptId: string;
      data: SubmitAnswerRequestDto;
    }) => exerciseService.submitAnswer(attemptId, data),
  });
}

/**
 * Submit all answers and complete attempt (batch mode)
 */
export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      data,
    }: {
      attemptId: string;
      data: SubmitAttemptRequestDto;
    }) => exerciseService.submitAttempt(attemptId, data),
    onSuccess: () => {
      // Invalidate sessions to refresh progress
      queryClient.invalidateQueries({ queryKey: exerciseKeys.sessions() });
    },
  });
}
