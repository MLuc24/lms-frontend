/**
 * Course Service
 * Handles all course-related API calls
 */

import { apiClient } from '@/api/client';
import type {
  CourseListResponseDto,
  CourseResponseDto,
  CourseDetailResponseDto,
  CourseQueryParams,
  EnrollmentResponseDto,
  EnrollmentListResponseDto,
  CourseProgressResponseDto,
  LessonResponseDto,
  LessonListResponseDto,
  CompleteLessonRequestDto,
  CompleteLessonResponseDto,
  UnitResponseDto,
  SkillResponseDto,
} from '@/types';

export const courseService = {
  // ============ COURSE ENDPOINTS ============

  /**
   * Get list of published courses
   * GET /courses
   */
  async getCourses(params?: CourseQueryParams): Promise<CourseListResponseDto> {
    const queryString = params ? buildQueryString(params) : '';
    return apiClient.get<CourseListResponseDto>(`/courses${queryString}`);
  },

  /**
   * Get course by ID
   * GET /courses/:courseId
   */
  async getCourseById(
    courseId: string,
    languageId?: number,
  ): Promise<CourseResponseDto> {
    const query = languageId ? `?languageId=${languageId}` : '';
    return apiClient.get<CourseResponseDto>(`/courses/${courseId}${query}`);
  },

  /**
   * Get course with full structure (units, skills, lessons)
   * GET /courses/:courseId/structure
   */
  async getCourseStructure(
    courseId: string,
    languageId?: number,
  ): Promise<CourseDetailResponseDto> {
    const query = languageId ? `?languageId=${languageId}` : '';
    return apiClient.get<CourseDetailResponseDto>(`/courses/${courseId}/structure${query}`);
  },

  // ============ LESSON ENDPOINTS ============
  async getLessonById(
    lessonId: string,
    languageId?: number,
  ): Promise<LessonResponseDto> {
    const query = languageId ? `?languageId=${languageId}` : '';
    return apiClient.get<LessonResponseDto>(`/lessons/${lessonId}${query}`);
  },

  // ============ ENROLLMENT ENDPOINTS ============

  /**
   * Enroll in a course
   * POST /courses/:courseId/enroll
   */
  async enrollCourse(courseId: string): Promise<EnrollmentResponseDto> {
    return apiClient.post<EnrollmentResponseDto>(
      `/courses/${courseId}/enroll`,
      {},
    );
  },

  /**
   * Unenroll from a course
   * DELETE /courses/:courseId/enroll
   */
  async unenrollCourse(courseId: string): Promise<void> {
    return apiClient.delete<void>(`/courses/${courseId}/enroll`);
  },

  /**
   * Get all my enrollments
   * GET /me/enrollments
   */
  async getMyEnrollments(): Promise<EnrollmentListResponseDto> {
    return apiClient.get<EnrollmentListResponseDto>('/me/enrollments');
  },

  /**
   * Get specific enrollment
   * GET /me/enrollments/:courseId
   */
  async getEnrollment(courseId: string): Promise<EnrollmentResponseDto> {
    return apiClient.get<EnrollmentResponseDto>(`/me/enrollments/${courseId}`);
  },

  // ============ PROGRESS ENDPOINTS ============

  /**
   * Get course progress
   * GET /me/enrollments/:courseId/progress
   */
  async getCourseProgress(courseId: string): Promise<CourseProgressResponseDto> {
    return apiClient.get<CourseProgressResponseDto>(
      `/me/enrollments/${courseId}/progress`,
    );
  },

  /**
   * Complete a lesson
   * POST /lessons/:lessonId/complete
   */
  async completeLesson(
    lessonId: string,
    data: CompleteLessonRequestDto,
  ): Promise<CompleteLessonResponseDto> {
    return apiClient.post<CompleteLessonResponseDto>(
      `/lessons/${lessonId}/complete`,
      data,
    );
  },
};

// ============ HELPERS ============

function buildQueryString(params: CourseQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.targetLanguageId) {
    searchParams.append('targetLanguageId', params.targetLanguageId.toString());
  }
  if (params.baseLanguageId) {
    searchParams.append('baseLanguageId', params.baseLanguageId.toString());
  }
  if (params.levelId) {
    searchParams.append('levelId', params.levelId.toString());
  }
  if (params.isPublished !== undefined) {
    searchParams.append('isPublished', params.isPublished.toString());
  }
  if (params.search) {
    searchParams.append('search', params.search);
  }
  if (params.languageId) {
    searchParams.append('languageId', params.languageId.toString());
  }
  if (params.page) {
    searchParams.append('page', params.page.toString());
  }
  if (params.limit) {
    searchParams.append('limit', params.limit.toString());
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
