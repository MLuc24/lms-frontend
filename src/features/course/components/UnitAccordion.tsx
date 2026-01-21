import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { SkillCard } from './SkillCard';
import { cn } from '@/shared/utils/cn';
import type { UnitResponseDto } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface UnitAccordionProps {
  /** Unit data */
  unit: UnitResponseDto;
  /** Unit index for display */
  index: number;
  /** Progress percentage */
  progress?: number;
  /** Whether unit is locked */
  isLocked?: boolean;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Skill press handler */
  onSkillPress?: (skillId: string) => void;
  /** Completed lesson IDs for skills */
  completedLessonIds?: string[];
  /** Custom class */
  className?: string;
}

export function UnitAccordion({
  unit,
  index,
  progress = 0,
  isLocked = false,
  defaultExpanded = false,
  onSkillPress,
  completedLessonIds = [],
  className,
}: UnitAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const title = unit.title || `Unit ${index + 1}`;
  const description = unit.description;
  const skills = unit.skills ?? [];

  const handleToggle = useCallback(() => {
    if (!isLocked) {
      setIsExpanded((prev) => !prev);
    }
  }, [isLocked]);

  const contentStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(isExpanded ? 1000 : 0, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      opacity: withTiming(isExpanded ? 1 : 0, {
        duration: 200,
      }),
    };
  }, [isExpanded]);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(isExpanded ? '180deg' : '0deg', {
            duration: 200,
          }),
        },
      ],
    };
  }, [isExpanded]);

  return (
    <View
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl overflow-hidden',
        isLocked && 'opacity-60',
        className,
      )}
    >
      {/* Header */}
      <Pressable
        onPress={handleToggle}
        disabled={isLocked}
        className={cn(
          'p-4 flex-row items-center',
          !isLocked && 'active:bg-gray-50 dark:active:bg-gray-700/50',
        )}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${isExpanded ? 'Collapse' : 'Expand'}`}
        accessibilityState={{ expanded: isExpanded }}
      >
        {/* Unit number badge */}
        <View
          className={cn(
            'w-10 h-10 rounded-full items-center justify-center mr-3',
            isLocked
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'bg-blue-100 dark:bg-blue-900/30',
          )}
        >
          {isLocked ? (
            <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
          ) : (
            <Text className="text-blue-600 dark:text-blue-400 font-bold">
              {index + 1}
            </Text>
          )}
        </View>

        {/* Title and description */}
        <View className="flex-1 mr-3">
          <Text
            className="text-base font-semibold text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {title}
          </Text>
          {description && (
            <Text
              className="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
              numberOfLines={1}
            >
              {description}
            </Text>
          )}
          {/* Progress */}
          {!isLocked && (
            <View className="mt-2">
              <ProgressBar progress={progress} size="sm" color="primary" />
            </View>
          )}
        </View>

        {/* Chevron */}
        {!isLocked && (
          <Animated.View style={chevronStyle}>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#9CA3AF"
            />
          </Animated.View>
        )}
      </Pressable>

      {/* Content */}
      <Animated.View style={contentStyle} className="overflow-hidden">
        <View className="px-4 pb-4 gap-3">
          {skills.map((skill, skillIndex) => {
            // Calculate skill completion
            const skillLessonIds = skill.lessons?.map((l) => l.lessonId) ?? [];
            const completedCount = skillLessonIds.filter((id) =>
              completedLessonIds.includes(id),
            ).length;
            const skillProgress =
              skillLessonIds.length > 0
                ? Math.round((completedCount / skillLessonIds.length) * 100)
                : 0;

            return (
              <SkillCard
                key={skill.skillId}
                skill={skill}
                progress={skillProgress}
                onPress={() => onSkillPress?.(skill.skillId)}
              />
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}
