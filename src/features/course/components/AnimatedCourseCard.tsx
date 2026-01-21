import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { CourseCard } from './CourseCard';
import type { CourseResponseDto } from '@/types';

interface AnimatedCourseCardProps {
  /** Course data */
  course: CourseResponseDto;
  /** Press handler */
  onPress?: () => void;
  /** Whether user is enrolled */
  isEnrolled?: boolean;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Status label */
  status?: 'in-progress' | 'new' | 'completed';
  /** Animation index for stagger effect */
  index: number;
  /** Custom class */
  className?: string;
}

export function AnimatedCourseCard({
  index,
  ...props
}: AnimatedCourseCardProps) {
  // Shared values for animations
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 100;
    
    opacity.value = withTiming(1, { 
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
    
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 150,
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <CourseCard {...props} />
    </Animated.View>
  );
}
