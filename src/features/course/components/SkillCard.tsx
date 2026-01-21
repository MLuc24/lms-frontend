import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Enhanced skill type configuration with gradients
const skillTypeConfig: Record<
  SkillType,
  { 
    icon: keyof typeof Ionicons.glyphMap; 
    gradient: readonly [string, string];
    lightBg: string;
    darkBg: string;
  }
> = {
  vocabulary: {
    icon: 'book',
    gradient: ['#3B82F6', '#2563EB'],
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900/20',
  },
  grammar: {
    icon: 'construct',
    gradient: ['#8B5CF6', '#7C3AED'],
    lightBg: 'bg-purple-50',
    darkBg: 'dark:bg-purple-900/20',
  },
  listening: {
    icon: 'headset',
    gradient: ['#EC4899', '#DB2777'],
    lightBg: 'bg-pink-50',
    darkBg: 'dark:bg-pink-900/20',
  },
  speaking: {
    icon: 'mic',
    gradient: ['#F59E0B', '#D97706'],
    lightBg: 'bg-amber-50',
    darkBg: 'dark:bg-amber-900/20',
  },
  reading: {
    icon: 'reader',
    gradient: ['#10B981', '#059669'],
    lightBg: 'bg-emerald-50',
    darkBg: 'dark:bg-emerald-900/20',
  },
  writing: {
    icon: 'pencil',
    gradient: ['#6366F1', '#4F46E5'],
    lightBg: 'bg-indigo-50',
    darkBg: 'dark:bg-indigo-900/20',
  },
  mixed: {
    icon: 'apps',
    gradient: ['#64748B', '#475569'],
    lightBg: 'bg-slate-50',
    darkBg: 'dark:bg-slate-900/20',
  },
};

export function SkillCard({
  skill,
  progress = 0,
  isLocked = false,
  onPress,
  className,
}: SkillCardProps) {
  const scale = useSharedValue(1);
  
  const title = skill.title || 'Skill';
  const description = skill.description;
  const config = skillTypeConfig[skill.skillType] || skillTypeConfig.mixed;
  const lessonCount = skill.lessons?.length ?? 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { 
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { 
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLocked}
      style={animatedStyle}
      className={cn(
        'rounded-2xl overflow-hidden',
        isLocked && 'opacity-50',
        className,
      )}
      accessibilityRole="button"
      accessibilityLabel={`${title} skill. ${progress}% complete. ${lessonCount} lessons`}
    >
      <View 
        className={cn(
          'flex-row items-center p-4',
          config.lightBg,
          config.darkBg,
        )}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        {/* Skill Icon with gradient */}
        <View className="mr-4">
          <View 
            className="w-14 h-14 rounded-2xl overflow-hidden"
            style={{
              shadowColor: config.gradient[0],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <LinearGradient
              colors={isLocked ? ['#D1D5DB', '#9CA3AF'] : config.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isLocked ? (
                <Ionicons name="lock-closed" size={22} color="white" />
              ) : (
                <Ionicons name={config.icon} size={24} color="white" />
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 mr-3">
          {/* Title */}
          <Text
            className="text-base font-bold text-gray-900 dark:text-white mb-0.5"
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {/* Description */}
          {description && (
            <Text
              className="text-sm text-gray-600 dark:text-gray-400 mb-2"
              numberOfLines={1}
            >
              {description}
            </Text>
          )}

          {/* Stats row */}
          <View className="flex-row items-center gap-3">
            {/* Lesson count */}
            <View className="flex-row items-center">
              <Ionicons 
                name="book-outline" 
                size={12} 
                color="#9CA3AF" 
              />
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
                {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
              </Text>
            </View>

            {/* Progress indicator */}
            {!isLocked && progress > 0 && (
              <View className="flex-row items-center">
                <View 
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ 
                    backgroundColor: progress >= 100 
                      ? '#10B981' 
                      : config.gradient[0] 
                  }}
                />
                <Text 
                  className={cn(
                    "text-xs font-bold",
                    progress >= 100 
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {progress >= 100 ? 'Completed' : `${progress}%`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Circle / Chevron */}
        <View className="items-center justify-center">
          {!isLocked && progress > 0 ? (
            <ProgressCircle
              progress={progress}
              size={48}
              strokeWidth={4}
              color={progress >= 100 ? 'success' : 'primary'}
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 items-center justify-center">
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color="#9CA3AF" 
              />
            </View>
          )}
        </View>
      </View>

      {/* Bottom progress bar for in-progress skills */}
      {!isLocked && progress > 0 && progress < 100 && (
        <View className="h-1 bg-gray-200 dark:bg-gray-700">
          <Animated.View
            className="h-full"
            style={{ width: `${progress}%` }}
          >
            <LinearGradient
              colors={config.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>
      )}
    </AnimatedPressable>
  );
}
