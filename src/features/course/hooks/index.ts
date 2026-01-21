/**
 * Course Hooks - Barrel Export
 */

// Query key factories
export { courseKeys } from './useCourses';
export { enrollmentKeys } from './useEnrollment';
export { lessonKeys } from './useLesson';

// Course hooks
export { useCourses, useInfiniteCourses } from './useCourses';
export { useCourse, useCourseStructure, useCourseUnits } from './useCourseDetail';

// Enrollment hooks
export {
  useMyEnrollments,
  useEnrollment,
  useEnrollCourse,
  useUnenrollCourse,
  useIsEnrolled,
} from './useEnrollment';

// Progress hooks
export {
  useCourseProgress,
  useCompleteLesson,
  useLessonProgress,
  useUnitProgress,
} from './useProgress';

// Lesson hooks
export { useLesson, useSkillLessons } from './useLesson';
