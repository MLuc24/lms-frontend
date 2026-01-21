import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/shared/utils/cn';
import type { LessonResponseDto, LessonType } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface LessonItemProps {
  /** Lesson data */
  lesson: LessonResponseDto;
  /** Whether lesson is completed */
  isCompleted?: boolean;
  /** Whether lesson is currently active */
  isActive?: boolean;
  /** Whether lesson is locked */
  isLocked?: boolean;
  /** Best score (0-100) */
  bestScore?: number;
  /** Press handler */
  onPress?: () => void;
  /** Custom class */
  className?: string;
}

// Lesson type icons
const lessonTypeConfig: Record<
  LessonType,
  { icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  practice: { icon: 'fitness', label: 'Practice' },
  story: { icon: 'book', label: 'Story' },
  dialogue: { icon: 'chatbubbles', label: 'Dialogue' },
  test: { icon: 'checkmark-circle', label: 'Test' },
  review: { icon: 'refresh', label: 'Review' },
};

export function LessonItem({
  lesson,
  isCompleted = false,
  isActive = false,
  isLocked = false,
  bestScore,
  onPress,
  className,
}: LessonItemProps) {
  const title = lesson.title || 'Lesson';
  const config = lessonTypeConfig[lesson.lessonType] || lessonTypeConfig.practice;

  const getIconColor = () => {
    if (isLocked) return '#9CA3AF';
    if (isCompleted) return '#22C55E';
    if (isActive) return '#3B82F6';
    return '#6B7280';
  };

  const getBackgroundStyle = () => {
    if (isActive) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
    if (isCompleted) return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800';
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      className={cn(
        'flex-row items-center p-3 rounded-xl border',
        getBackgroundStyle(),
        !isLocked && 'active:opacity-90',
        isLocked && 'opacity-50',
        className,
      )}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${config.label} lesson. ${isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Not started'}`}
    >
      {/* Lesson type icon */}
      <View
        className={cn(
          'w-10 h-10 rounded-full items-center justify-center mr-3',
          isCompleted
            ? 'bg-green-100 dark:bg-green-900/30'
            : isActive
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : 'bg-gray-100 dark:bg-gray-700',
        )}
      >
        {isLocked ? (
          <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
        ) : isCompleted ? (
          <Ionicons name="checkmark" size={20} color="#22C55E" />
        ) : (
          <Ionicons name={config.icon} size={18} color={getIconColor()} />
        )}
      </View>

      {/* Content */}
      <View className="flex-1 mr-2">
        <Text
          className={cn(
            'text-base font-medium',
            isCompleted
              ? 'text-green-700 dark:text-green-400'
              : isActive
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-900 dark:text-white',
          )}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="flex-row items-center mt-0.5">
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {config.label}
          </Text>
          {lesson.estimatedMinutes && (
            <>
              <Text className="text-xs text-gray-400 mx-1">•</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {lesson.estimatedMinutes} min
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Score badge (if completed) */}
      {isCompleted && bestScore !== undefined && (
        <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
          <Text className="text-xs font-semibold text-green-700 dark:text-green-400">
            {bestScore}%
          </Text>
        </View>
      )}

      {/* Chevron (if not locked and not completed) */}
      {!isLocked && !isCompleted && (
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      )}
    </Pressable>
  );
}
