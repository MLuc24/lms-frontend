import React from 'react';
import { View, Text, Image } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { PressableCard } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { cn } from '@/shared/utils/cn';
import { courseService } from '../services/course.service';
import { courseKeys } from '../hooks/useCourses';
import { DEFAULT_LANGUAGE_ID } from '../utils/localization';
import type { CourseResponseDto } from '@/types';

interface CourseCardProps {
  /** Course data */
  course: CourseResponseDto;
  /** Press handler */
  onPress?: () => void;
  /** Whether user is enrolled */
  isEnrolled?: boolean;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Custom class */
  className?: string;
}

const levelLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
};

const levelVariants: Record<number, 'success' | 'warning' | 'error'> = {
  1: 'success',
  2: 'warning',
  3: 'error',
};

export function CourseCard({
  course,
  onPress,
  isEnrolled = false,
  progress,
  className,
}: CourseCardProps) {
  const queryClient = useQueryClient();
  const title = course.title || 'Untitled Course';
  const description = course.description || '';

  // Prefetch course structure on press for instant navigation
  const handlePress = () => {
    // Prefetch immediately
    queryClient.prefetchQuery({
      queryKey: courseKeys.structure(course.courseId),
      queryFn: () => courseService.getCourseStructure(course.courseId, DEFAULT_LANGUAGE_ID),
      staleTime: 10 * 60 * 1000,
    });
    
    onPress?.();
  };

  return (
    <PressableCard
      onPress={handlePress}
      padding="none"
      shadow="md"
      className={cn('overflow-hidden', className)}
      accessibilityRole="button"
      accessibilityLabel={`${title} course. ${isEnrolled ? `${progress ?? 0}% complete` : 'Not enrolled'}`}
    >
      {/* Thumbnail placeholder */}
      <View className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
        <Text className="text-4xl">📚</Text>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Header with badges */}
        <View className="flex-row items-center gap-2 mb-2">
          <Badge variant={levelVariants[course.levelId] ?? 'default'} size="sm">
            {levelLabels[course.levelId] ?? `Level ${course.levelId}`}
          </Badge>
          {isEnrolled && (
            <Badge variant="primary" size="sm">
              Enrolled
            </Badge>
          )}
        </View>

        {/* Title */}
        <Text
          className="text-lg font-bold text-gray-900 dark:text-white mb-1"
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text
            className="text-sm text-gray-500 dark:text-gray-400 mb-3"
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        {/* Progress (if enrolled) */}
        {isEnrolled && progress !== undefined && (
          <ProgressBar
            progress={progress}
            size="sm"
            color="primary"
            showLabel
          />
        )}

        {/* Course code */}
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {course.courseCode}
        </Text>
      </View>
    </PressableCard>
  );
}
