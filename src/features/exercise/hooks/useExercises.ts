/**
 * useExercises Hook
 * Fetch exercises for a lesson
 */

import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '../services/exercise.service';

export const exerciseKeys = {
  all: ['exercises'] as const,
  byLesson: (lessonId: string) => [...exerciseKeys.all, 'lesson', lessonId] as const,
  detail: (exerciseId: string) => [...exerciseKeys.all, 'detail', exerciseId] as const,
  sessions: () => [...exerciseKeys.all, 'sessions'] as const,
  session: (sessionId: string) => [...exerciseKeys.sessions(), sessionId] as const,
};

/**
 * Fetch exercises for a lesson
 */
export function useExercises(lessonId: string) {
  return useQuery({
    queryKey: exerciseKeys.byLesson(lessonId),
    queryFn: () => exerciseService.getExercisesByLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 10 * 60 * 1000, // 10 minutes (exercises don't change often)
  });
}

/**
 * Fetch single exercise with full detail
 */
export function useExerciseDetail(exerciseId: string) {
  return useQuery({
    queryKey: exerciseKeys.detail(exerciseId),
    queryFn: () => exerciseService.getExerciseDetail(exerciseId),
    enabled: !!exerciseId,
    staleTime: 10 * 60 * 1000,
  });
}
