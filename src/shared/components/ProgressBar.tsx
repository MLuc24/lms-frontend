import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/shared/utils/cn';

interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  progress: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'error';
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom class for container */
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorStyles = {
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export function ProgressBar({
  progress,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className,
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${clampedProgress}%`, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    };
  }, [clampedProgress]);

  return (
    <View className={cn('w-full', className)}>
      {showLabel && (
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            Progress
          </Text>
          <Text className="text-xs font-medium text-gray-900 dark:text-white">
            {Math.round(clampedProgress)}%
          </Text>
        </View>
      )}
      <View
        className={cn(
          'w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
          sizeStyles[size],
        )}
      >
        <Animated.View
          style={animatedStyle}
          className={cn('h-full rounded-full', colorStyles[color])}
        />
      </View>
    </View>
  );
}
