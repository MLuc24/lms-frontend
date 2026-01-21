/**
 * useCourseDetail Hook
 * Fetch single course details and structure
 */

import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import { courseKeys } from './useCourses';
import { DEFAULT_LANGUAGE_ID } from '../utils/localization';

/**
 * Fetch course basic info
 */
export function useCourse(courseId: string, languageId?: number) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseService.getCourseById(courseId, languageId ?? DEFAULT_LANGUAGE_ID),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Fetch course with full structure (units, skills, lessons)
 */
export function useCourseStructure(courseId: string, languageId?: number) {
  return useQuery({
    queryKey: courseKeys.structure(courseId),
    queryFn: () => courseService.getCourseStructure(courseId, languageId ?? DEFAULT_LANGUAGE_ID),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 2,
  });
}

/**
 * Fetch units for a course
 */
export function useCourseUnits(courseId: string, languageId?: number) {
  return useQuery({
    queryKey: [...courseKeys.detail(courseId), 'units'],
    queryFn: () => courseService.getUnits(courseId, languageId ?? DEFAULT_LANGUAGE_ID),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
