/**
 * useProgress Hook
 * Handle course and lesson progress tracking
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import { enrollmentKeys } from './useEnrollment';

/**
 * Fetch course progress
 */
export function useCourseProgress(courseId: string, enabled = true) {
  return useQuery({
    queryKey: enrollmentKeys.progress(courseId),
    queryFn: () => courseService.getCourseProgress(courseId),
    enabled: !!courseId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Complete a lesson
 */
export function useCompleteLesson(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, score }: { lessonId: string; score: number }) =>
      courseService.completeLesson(lessonId, { score }),
    onSuccess: () => {
      // Invalidate progress to reflect completion
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.progress(courseId),
      });
      // Also invalidate enrollments in case status changed to completed
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
    },
  });
}

/**
 * Get lesson progress from course progress data
 */
export function useLessonProgress(courseId: string, lessonId: string) {
  const { data: progress } = useCourseProgress(courseId);

  const lessonProgress = progress?.lessonProgress?.find(
    (lp) => lp.lessonId === lessonId,
  );

  return {
    isCompleted: !!lessonProgress?.completedAt,
    bestScore: lessonProgress?.bestScore ?? 0,
    attemptsCount: lessonProgress?.attemptsCount ?? 0,
    lastScore: lessonProgress?.lastScore ?? 0,
  };
}

/**
 * Calculate unit progress from course progress
 */
export function useUnitProgress(
  courseId: string,
  unitLessonIds: string[],
) {
  const { data: progress } = useCourseProgress(courseId);

  if (!progress) {
    return { completed: 0, total: unitLessonIds.length, percentage: 0 };
  }

  const completedLessons = progress.lessonProgress.filter(
    (lp) => unitLessonIds.includes(lp.lessonId) && lp.completedAt,
  ).length;

  return {
    completed: completedLessons,
    total: unitLessonIds.length,
    percentage: unitLessonIds.length > 0
      ? Math.round((completedLessons / unitLessonIds.length) * 100)
      : 0,
  };
}
