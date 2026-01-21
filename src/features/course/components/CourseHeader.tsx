import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { cn } from '@/shared/utils/cn';
import type { CourseResponseDto, CourseProgressResponseDto, EnrollmentResponseDto } from '@/types';
import { EnrollmentStatus } from '@/types';

interface CourseHeaderProps {
  /** Course data */
  course: CourseResponseDto;
  /** Enrollment data (if enrolled) */
  enrollment?: EnrollmentResponseDto;
  /** Progress data (if enrolled) */
  progress?: CourseProgressResponseDto;
  /** Enroll loading state */
  isEnrolling?: boolean;
  /** Enroll handler */
  onEnroll?: () => void;
  /** Continue learning handler */
  onContinue?: () => void;
  /** Custom class */
  className?: string;
}

const levelLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
};

export function CourseHeader({
  course,
  enrollment,
  progress,
  isEnrolling,
  onEnroll,
  onContinue,
  className,
}: CourseHeaderProps) {
  const title = course.title || 'Untitled Course';
  const description = course.description;
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === EnrollmentStatus.COMPLETED;

  return (
    <View className={cn('relative', className)}>
      {/* Hero background */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        {/* Badges */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <Badge variant="default" size="md">
            <Text className="text-white/90">
              {levelLabels[course.levelId] ?? `Level ${course.levelId}`}
            </Text>
          </Badge>
          {isCompleted && (
            <Badge variant="success" size="md">
              Completed
            </Badge>
          )}
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-white mb-2">
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text className="text-base text-white/80 mb-4" numberOfLines={3}>
            {description}
          </Text>
        )}

        {/* Progress (if enrolled) */}
        {isEnrolled && progress && (
          <View className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-white/80">
                {progress.completedLessons} of {progress.totalLessons} lessons
              </Text>
              <Text className="text-sm font-medium text-white">
                {progress.progressPercentage}%
              </Text>
            </View>
            <View className="bg-white/20 rounded-full h-2 overflow-hidden">
              <View
                className="bg-white h-full rounded-full"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </View>
          </View>
        )}

        {/* Action button */}
        <View className="mt-2">
          {isEnrolled ? (
            <Button
              variant="secondary"
              size="lg"
              onPress={onContinue}
              className="bg-white"
            >
              <Text className="text-blue-600 font-semibold text-base">
                {isCompleted ? 'Review Course' : 'Continue Learning'}
              </Text>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onPress={onEnroll}
              isLoading={isEnrolling}
              className="bg-white"
            >
              <Text className="text-blue-600 font-semibold text-base">
                Start Learning
              </Text>
            </Button>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
