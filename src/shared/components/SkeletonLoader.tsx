import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { cn } from '@/shared/utils/cn';

interface SkeletonLoaderProps {
  /** Variant type */
  variant?: 'text' | 'card' | 'avatar' | 'thumbnail';
  /** Width (for text/custom) */
  width?: number | string;
  /** Height (for text/custom) */
  height?: number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Number of items to render */
  count?: number;
  /** Custom class */
  className?: string;
}

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

function SkeletonItem({
  width,
  height,
  rounded = 'md',
  className,
}: Omit<SkeletonLoaderProps, 'variant' | 'count'>) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true,
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 1], [0.5, 1]);
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        typeof width === 'number' ? { width } : undefined,
        height ? { height } : undefined,
      ]}
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        roundedStyles[rounded],
        typeof width === 'string' && width === '100%' && 'w-full',
        className,
      )}
    />
  );
}

export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  rounded,
  count = 1,
  className,
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return { width: 48, height: 48, rounded: 'full' as const };
      case 'thumbnail':
        return { width: '100%' as const, height: 160, rounded: 'lg' as const };
      case 'card':
        return { width: '100%' as const, height: 120, rounded: 'lg' as const };
      case 'text':
      default:
        return { width: width ?? '100%', height: height ?? 16, rounded: 'md' as const };
    }
  };

  const styles = getVariantStyles();

  return (
    <View className={cn('gap-2', className)}>
      {items.map((i) => (
        <SkeletonItem
          key={i}
          width={styles.width}
          height={styles.height}
          rounded={rounded ?? styles.rounded}
        />
      ))}
    </View>
  );
}
