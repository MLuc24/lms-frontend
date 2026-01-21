import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  CourseHeader,
  UnitAccordion,
} from '@/features/course/components';
import {
  useCourseStructure,
  useEnrollment,
  useEnrollCourse,
  useCourseProgress,
} from '@/features/course/hooks';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { EmptyState } from '@/shared/components/EmptyState';

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();

  // Fetch course data
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseStructure(courseId || '');

  // Fetch enrollment
  const { data: enrollment } = useEnrollment(courseId || '');

  // Fetch progress (only if enrolled)
  const { data: progress } = useCourseProgress(courseId || '', !!enrollment);

  // Enroll mutation
  const enrollMutation = useEnrollCourse();

  // Get completed lesson IDs
  const completedLessonIds = useMemo(() => {
    return (
      progress?.lessonProgress
        ?.filter((lp) => lp.completedAt)
        .map((lp) => lp.lessonId) ?? []
    );
  }, [progress]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEnroll = useCallback(() => {
    if (courseId) {
      enrollMutation.mutate(courseId);
    }
  }, [courseId, enrollMutation]);

  const handleContinue = useCallback(() => {
    // Find first incomplete lesson
    if (course?.units && progress) {
      for (const unit of course.units) {
        for (const skill of unit.skills ?? []) {
          for (const lesson of skill.lessons ?? []) {
            if (!completedLessonIds.includes(lesson.lessonId)) {
              router.push(`/lesson/${lesson.lessonId}?courseId=${courseId}`);
              return;
            }
          }
        }
      }
    }
    // If all complete, go to first lesson
    const firstLesson = course?.units?.[0]?.skills?.[0]?.lessons?.[0];
    if (firstLesson) {
      router.push(`/lesson/${firstLesson.lessonId}?courseId=${courseId}`);
    }
  }, [course, progress, completedLessonIds, router, courseId]);

  const handleSkillPress = useCallback(
    (skillId: string) => {
      // Navigate to skill detail or first lesson of skill
      router.push(`/skill/${skillId}?courseId=${courseId}`);
    },
    [router, courseId],
  );

  // Calculate unit progress
  const getUnitProgress = useCallback(
    (unitIndex: number) => {
      const unit = course?.units?.[unitIndex];
      if (!unit || !progress) return 0;

      let totalLessons = 0;
      let completedCount = 0;

      for (const skill of unit.skills ?? []) {
        for (const lesson of skill.lessons ?? []) {
          totalLessons++;
          if (completedLessonIds.includes(lesson.lessonId)) {
            completedCount++;
          }
        }
      }

      return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    },
    [course, progress, completedLessonIds],
  );

  // Loading state
  if (courseLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="p-4">
          <SkeletonLoader variant="card" />
          <View className="mt-4 gap-3">
            <SkeletonLoader height={80} />
            <SkeletonLoader height={80} />
            <SkeletonLoader height={80} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (courseError || !course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="p-4">
          <Pressable onPress={handleBack} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
        </View>
        <EmptyState
          title="Course not found"
          description="The course you're looking for doesn't exist or has been removed"
          action={{ label: 'Go Back', onPress: handleBack }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Back button (absolute) */}
        <Pressable
          onPress={handleBack}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-black/20 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>

        {/* Course Header */}
        <CourseHeader
          course={course}
          enrollment={enrollment}
          progress={progress}
          isEnrolling={enrollMutation.isPending}
          onEnroll={handleEnroll}
          onContinue={handleContinue}
        />

        {/* Units List */}
        <View className="px-4 py-6 gap-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Course Content
          </Text>

          {course.units?.map((unit, index) => (
            <UnitAccordion
              key={unit.unitId}
              unit={unit}
              index={index}
              progress={getUnitProgress(index)}
              isLocked={!enrollment && index > 0}
              defaultExpanded={index === 0}
              onSkillPress={handleSkillPress}
              completedLessonIds={completedLessonIds}
            />
          ))}

          {(!course.units || course.units.length === 0) && (
            <View className="items-center py-8">
              <Text className="text-gray-500 dark:text-gray-400">
                No content available yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
