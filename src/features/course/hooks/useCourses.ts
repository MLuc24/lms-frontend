/**
 * useCourses Hook
 * Fetch paginated list of courses with filters
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import type { CourseQueryParams, CourseListResponseDto } from '@/types';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: CourseQueryParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: string) => [...courseKeys.details(), courseId] as const,
  structure: (courseId: string) => [...courseKeys.detail(courseId), 'structure'] as const,
};

/**
 * Fetch paginated list of courses
 */
export function useCourses(params?: CourseQueryParams) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => courseService.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Infinite scroll for courses
 */
export function useInfiniteCourses(params?: Omit<CourseQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...courseKeys.list(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      courseService.getCourses({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CourseListResponseDto) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
