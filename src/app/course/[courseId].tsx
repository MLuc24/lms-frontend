import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
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
  const scrollViewRef = useRef<ScrollView>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

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

  // Handle View All Units - toggle visibility
  const handleViewAllUnits = useCallback(() => {
    setIsContentVisible((prev) => !prev);
  }, []);

  // Animated style for content section
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(isContentVisible ? 5000 : 0, { duration: 400 }),
      opacity: withTiming(isContentVisible ? 1 : 0, { duration: 300 }),
    };
  }, [isContentVisible]);

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
      <ScrollView 
        ref={scrollViewRef} 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Back button (floating) */}
        <Animated.View
          entering={FadeIn.duration(400)}
          className="absolute top-4 left-4 z-20"
        >
          <Pressable
            onPress={handleBack}
            className="w-11 h-11 rounded-full bg-white/95 dark:bg-gray-800/95 items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </Pressable>
        </Animated.View>

        {/* Course Header */}
        <CourseHeader
          course={course}
          enrollment={enrollment}
          progress={progress}
          isEnrolling={enrollMutation.isPending}
          onEnroll={handleEnroll}
          onContinue={handleContinue}
          onViewAllUnits={handleViewAllUnits}
          isContentVisible={isContentVisible}
        />

        {/* Course Content Section */}
        <Animated.View 
          style={contentAnimatedStyle}
          className="overflow-hidden px-4 pt-8 pb-4"
        >
          {/* Section Header */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-2xl font-black text-gray-900 dark:text-white">
                  Course Content
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {course.units?.length || 0} units • {progress?.totalLessons || 0} lessons
                </Text>
              </View>
              
              {/* Progress indicator if enrolled */}
              {enrollment && (
                <View className="items-end">
                  <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Overall
                  </Text>
                  <Text className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {progress?.progressPercentage || 0}%
                  </Text>
                </View>
              )}
            </View>
            
            {/* Divider */}
            <View className="h-1 rounded-full bg-blue-500 mt-2" />
          </View>

          {/* Units List */}
          <View className="gap-4">
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
          </View>

          {/* Empty state */}
          {(!course.units || course.units.length === 0) && (
            <Animated.View 
              entering={FadeInDown.duration(500)}
              className="items-center py-16"
            >
              <View 
                className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4"
              >
                <Ionicons name="book-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No Content Yet
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center px-8">
                This course doesn't have any units or lessons yet
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
