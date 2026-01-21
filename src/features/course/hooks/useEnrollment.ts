/**
 * useEnrollment Hook
 * Handle course enrollment actions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import { courseKeys } from './useCourses';

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  lists: () => [...enrollmentKeys.all, 'list'] as const,
  detail: (courseId: string) => [...enrollmentKeys.all, courseId] as const,
  progress: (courseId: string) => [...enrollmentKeys.detail(courseId), 'progress'] as const,
};

/**
 * Fetch all user enrollments
 */
export function useMyEnrollments() {
  return useQuery({
    queryKey: enrollmentKeys.lists(),
    queryFn: () => courseService.getMyEnrollments(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch specific enrollment
 */
export function useEnrollment(courseId: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(courseId),
    queryFn: () => courseService.getEnrollment(courseId),
    enabled: !!courseId,
    retry: false, // Don't retry if not enrolled
  });
}

/**
 * Enroll in a course
 */
export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.enrollCourse(courseId),
    onSuccess: (data, courseId) => {
      // Invalidate enrollments list
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      // Set enrollment data
      queryClient.setQueryData(enrollmentKeys.detail(courseId), data);
      // Invalidate course details to refresh enrollment status
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
  });
}

/**
 * Unenroll from a course
 */
export function useUnenrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.unenrollCourse(courseId),
    onSuccess: (_, courseId) => {
      // Invalidate and remove enrollment data
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      queryClient.removeQueries({ queryKey: enrollmentKeys.detail(courseId) });
      queryClient.removeQueries({ queryKey: enrollmentKeys.progress(courseId) });
    },
  });
}

/**
 * Check if user is enrolled in a course
 */
export function useIsEnrolled(courseId: string) {
  const { data: enrollments } = useMyEnrollments();

  return enrollments?.data?.some(
    (enrollment) => enrollment.courseId === courseId,
  ) ?? false;
}
