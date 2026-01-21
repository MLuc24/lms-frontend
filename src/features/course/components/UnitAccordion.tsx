import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
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

  // Calculate unit stats
  const totalLessons = useMemo(() => {
    return skills.reduce((sum, skill) => sum + (skill.lessons?.length || 0), 0);
  }, [skills]);

  const estimatedMinutes = totalLessons * 30; // 30 min per lesson
  const estimatedTime = estimatedMinutes >= 60 
    ? `${Math.ceil(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`
    : `${estimatedMinutes}m`;

  const handleToggle = useCallback(() => {
    if (!isLocked) {
      setIsExpanded((prev) => !prev);
    }
  }, [isLocked]);

  const contentStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(isExpanded ? 2000 : 0, {
        duration: 400,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      opacity: withTiming(isExpanded ? 1 : 0, {
        duration: 300,
      }),
    };
  }, [isExpanded]);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(isExpanded ? '180deg' : '0deg', {
            duration: 250,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
        },
      ],
    };
  }, [isExpanded]);

  const progressColorClass = progress >= 100 
    ? 'from-emerald-500 to-teal-500'
    : progress > 0 
    ? 'from-blue-500 to-purple-500'
    : 'from-gray-400 to-gray-500';

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(500)}
      className={cn(
        'rounded-2xl overflow-hidden',
        'shadow-md',
        isLocked && 'opacity-70',
        className,
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Card Background with gradient accent */}
      <View className="bg-white dark:bg-gray-800 overflow-hidden">
        {/* Top gradient accent bar */}
        {!isLocked && (
          <LinearGradient
            colors={
              progress >= 100
                ? ['#10B981', '#14B8A6'] 
                : progress > 0
                ? ['#3B82F6', '#8B5CF6']
                : ['#E5E7EB', '#D1D5DB']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 4 }}
          />
        )}

        {/* Header */}
        <Pressable
          onPress={handleToggle}
          disabled={isLocked}
          className={cn(
            'p-5',
            !isLocked && 'active:bg-gray-50 dark:active:bg-gray-700/50',
          )}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${isExpanded ? 'Collapse' : 'Expand'}`}
          accessibilityState={{ expanded: isExpanded }}
        >
          <View className="flex-row items-start">
            {/* Unit number badge */}
            <View className="mr-4 mt-1">
              <View
                className={cn(
                  'w-12 h-12 rounded-2xl items-center justify-center',
                  isLocked
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : progress >= 100
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-br from-blue-500 to-purple-500',
                )}
              >
                {isLocked ? (
                  <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                ) : progress >= 100 ? (
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                ) : (
                  <Text className="text-white font-black text-lg">
                    {index + 1}
                  </Text>
                )}
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
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
                  className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-5"
                  numberOfLines={2}
                >
                  {description}
                </Text>
              )}

              {/* Stats row */}
              <View className="flex-row items-center gap-4 mb-3">
                {/* Lessons count */}
                <View className="flex-row items-center">
                  <Ionicons 
                    name="book-outline" 
                    size={14} 
                    color={isLocked ? "#9CA3AF" : "#6B7280"} 
                  />
                  <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-1.5">
                    {totalLessons} lessons
                  </Text>
                </View>

                {/* Estimated time */}
                <View className="flex-row items-center">
                  <Ionicons 
                    name="time-outline" 
                    size={14} 
                    color={isLocked ? "#9CA3AF" : "#6B7280"} 
                  />
                  <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-1.5">
                    ~{estimatedTime}
                  </Text>
                </View>

                {/* Progress percentage */}
                {!isLocked && progress > 0 && (
                  <View className="flex-row items-center">
                    <Ionicons 
                      name="checkmark-circle" 
                      size={14} 
                      color={progress >= 100 ? "#10B981" : "#3B82F6"} 
                    />
                    <Text 
                      className={cn(
                        "text-xs font-bold ml-1.5",
                        progress >= 100 
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {progress}%
                    </Text>
                  </View>
                )}
              </View>

              {/* Progress bar */}
              {!isLocked && (
                <View className="mb-2">
                  <ProgressBar 
                    progress={progress} 
                    size="sm" 
                    color={progress >= 100 ? 'success' : 'primary'} 
                  />
                </View>
              )}
            </View>

            {/* Chevron */}
            {!isLocked && (
              <Animated.View 
                style={chevronStyle}
                className="ml-2 mt-1"
              >
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color="#9CA3AF"
                />
              </Animated.View>
            )}
          </View>
        </Pressable>

        {/* Content - Skills */}
        <Animated.View style={contentStyle} className="overflow-hidden">
          <View className="px-5 pb-5 gap-3">
            {/* Skills header */}
            <View className="flex-row items-center mb-1">
              <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <Text className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mx-3">
                {skills.length} Skills
              </Text>
              <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </View>

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
    </Animated.View>
  );
}
