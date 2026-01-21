import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ProgressCircle } from '@/shared/components/ProgressCircle';
import { cn } from '@/shared/utils/cn';
import type { SkillResponseDto } from '@/types';
import { SkillType } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface SkillCardProps {
  /** Skill data */
  skill: SkillResponseDto;
  /** Progress percentage */
  progress?: number;
  /** Whether skill is locked */
  isLocked?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Custom class */
  className?: string;
}

// Skill type icons and colors
const skillTypeConfig: Record<
  SkillType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }
> = {
  vocabulary: {
    icon: 'book',
    color: '#3B82F6',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  grammar: {
    icon: 'construct',
    color: '#8B5CF6',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  listening: {
    icon: 'headset',
    color: '#EC4899',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  speaking: {
    icon: 'mic',
    color: '#F59E0B',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  reading: {
    icon: 'reader',
    color: '#10B981',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  writing: {
    icon: 'pencil',
    color: '#6366F1',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  mixed: {
    icon: 'apps',
    color: '#64748B',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
  },
};

export function SkillCard({
  skill,
  progress = 0,
  isLocked = false,
  onPress,
  className,
}: SkillCardProps) {
  const title = skill.title || 'Skill';
  const description = skill.description;
  const config = skillTypeConfig[skill.skillType] || skillTypeConfig.mixed;
  const lessonCount = skill.lessons?.length ?? 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      className={cn(
        'flex-row items-center p-3 rounded-lg',
        'bg-gray-50 dark:bg-gray-700/50',
        !isLocked && 'active:bg-gray-100 dark:active:bg-gray-700',
        isLocked && 'opacity-50',
        className,
      )}
      accessibilityRole="button"
      accessibilityLabel={`${title} skill. ${progress}% complete. ${lessonCount} lessons`}
    >
      {/* Skill icon */}
      <View
        className={cn(
          'w-12 h-12 rounded-xl items-center justify-center mr-3',
          config.bgColor,
        )}
      >
        {isLocked ? (
          <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
        ) : (
          <Ionicons name={config.icon} size={22} color={config.color} />
        )}
      </View>

      {/* Content */}
      <View className="flex-1 mr-3">
        <Text
          className="text-base font-medium text-gray-900 dark:text-white"
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
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
        </Text>
      </View>

      {/* Progress circle */}
      {!isLocked && (
        <ProgressCircle
          progress={progress}
          size={44}
          strokeWidth={4}
          color={progress >= 100 ? 'success' : 'primary'}
        />
      )}
    </Pressable>
  );
}
