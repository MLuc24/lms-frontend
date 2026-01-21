/**
 * useLesson Hook
 * Handle lesson data and actions
 */

import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import { DEFAULT_LANGUAGE_ID } from '../utils/localization';

export const lessonKeys = {
  all: ['lessons'] as const,
  detail: (lessonId: string) => [...lessonKeys.all, lessonId] as const,
  bySkill: (skillId: string) => [...lessonKeys.all, 'skill', skillId] as const,
};

/**
 * Fetch lesson by ID
 */
export function useLesson(lessonId: string, languageId?: number) {
  return useQuery({
    queryKey: lessonKeys.detail(lessonId),
    queryFn: () => courseService.getLessonById(lessonId, languageId ?? DEFAULT_LANGUAGE_ID),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch lessons for a skill
 */
export function useSkillLessons(skillId: string, languageId?: number) {
  return useQuery({
    queryKey: lessonKeys.bySkill(skillId),
    queryFn: () => courseService.getLessons(skillId, languageId ?? DEFAULT_LANGUAGE_ID),
    enabled: !!skillId,
    staleTime: 5 * 60 * 1000,
  });
}
