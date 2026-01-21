import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/shared/utils/cn';

interface ProgressCircleProps {
  /** Progress value from 0 to 100 */
  progress: number;
  /** Size of the circle in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'error';
  /** Show percentage in center */
  showLabel?: boolean;
  /** Custom content in center */
  children?: React.ReactNode;
  /** Custom class */
  className?: string;
}

const colorMap = {
  primary: 'border-blue-500',
  success: 'border-green-500',
  warning: 'border-yellow-500',
  error: 'border-red-500',
};

const bgColorMap = {
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

/**
 * Simple Progress Circle using border-based approach
 * For a more sophisticated SVG version, install react-native-svg
 */
export function ProgressCircle({
  progress,
  size = 64,
  strokeWidth = 6,
  color = 'primary',
  showLabel = true,
  children,
  className,
}: ProgressCircleProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    };
  }, [clampedProgress]);

  // Use a simple circular progress indicator
  const innerSize = size - strokeWidth * 2;

  return (
    <View className={cn('items-center justify-center', className)}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
          },
        ]}
        className={cn(
          'rounded-full items-center justify-center border-4',
          colorMap[color],
        )}
      >
        {/* Inner circle with percentage fill effect */}
        <View
          className="rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
          style={{
            width: innerSize,
            height: innerSize,
          }}
        >
          {children ?? (
            showLabel && (
              <Text className="text-sm font-bold text-gray-900 dark:text-white">
                {Math.round(clampedProgress)}%
              </Text>
            )
          )}
        </View>
      </Animated.View>
    </View>
  );
}
