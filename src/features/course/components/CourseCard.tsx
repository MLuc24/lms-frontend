import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '@/shared/utils/cn';
import { getMediaUrl } from '@/shared/utils/media';
import { courseService } from '../services/course.service';
import { courseKeys } from '../hooks/useCourses';
import { DEFAULT_LANGUAGE_ID } from '../utils/localization';
import type { CourseResponseDto } from '@/types';

interface CourseCardProps {
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
  /** Custom class */
  className?: string;
}

const levelLabels: Record<number, string> = {
  1: 'A1',
  2: 'B1',
  3: 'C1',
};

// Gradient colors for different course levels/types
const gradientPresets: readonly [string, string, string][] = [
  ['#4A90E2', '#2C5F8D', '#1E3A5F'], // Blue tones
  ['#D2691E', '#8B4513', '#654321'], // Brown/Rust tones
  ['#7B68EE', '#6A5ACD', '#483D8B'], // Purple tones
  ['#20B2AA', '#008B8B', '#006666'], // Teal tones
  ['#FF6B6B', '#C44569', '#8B3A62'], // Red/Pink tones
];

export function CourseCard({
  course,
  onPress,
  isEnrolled = false,
  progress,
  status,
  className,
}: CourseCardProps) {
  const queryClient = useQueryClient();
  const title = course.title || 'Untitled Course';
  const description = course.description || '';
  
  // Select gradient based on course ID
  const gradientIndex = parseInt(course.courseId.slice(0, 8), 16) % gradientPresets.length;
  const gradientColors = gradientPresets[gradientIndex];
  
  // Get cover image URL
  const coverImageUrl = getMediaUrl(course.coverUrl);
  const hasCoverImage = !!coverImageUrl;

  // Prefetch course structure on press for instant navigation
  const handlePress = () => {
    queryClient.prefetchQuery({
      queryKey: courseKeys.structure(course.courseId),
      queryFn: () => courseService.getCourseStructure(course.courseId, DEFAULT_LANGUAGE_ID),
      staleTime: 10 * 60 * 1000,
    });
    
    onPress?.();
  };

  // Auto-detect status if not provided
  const displayStatus = status || (
    isEnrolled 
      ? progress && progress > 0 && progress < 100 
        ? 'in-progress' 
        : progress === 100 
          ? 'completed' 
          : 'new'
      : undefined
  );

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        'rounded-3xl overflow-hidden shadow-lg shadow-black/25',
        'active:scale-[0.98] transition-transform',
        className
      )}
      accessibilityRole="button"
      accessibilityLabel={`${title} course. ${isEnrolled ? `${progress ?? 0}% complete` : 'Not enrolled'}`}
    >
      {/* Card Container */}
      <View className="bg-white dark:bg-gray-800">
        {/* Hero Section with Gradient */}
        <View className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
          {hasCoverImage ? (
            <>
              {/* Cover Image */}
              <Image
                source={{ uri: coverImageUrl }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {/* Dark overlay for text readability */}
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
            </>
          ) : (
            <>
              {/* Gradient Background (fallback) */}
              <LinearGradient
                colors={gradientColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              
              {/* Abstract Pattern Overlay */}
              <View className="absolute inset-0 opacity-20">
                <View className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/30" />
                <View className="absolute -left-5 bottom-0 w-32 h-32 rounded-full bg-black/20" />
                <View className="absolute right-1/3 top-1/2 w-24 h-24 rounded-full bg-white/20" />
              </View>
            </>
          )}
          
          {/* Status Badge */}
          {displayStatus && (
            <View className="absolute top-4 left-4">
              <View className={cn(
                'px-4 py-1.5 rounded-full',
                displayStatus === 'in-progress' && 'bg-blue-500',
                displayStatus === 'new' && 'bg-green-500',
                displayStatus === 'completed' && 'bg-purple-500'
              )}>
                <Text className="text-white text-sm font-semibold capitalize">
                  {displayStatus === 'in-progress' ? 'In Progress' : displayStatus}
                </Text>
              </View>
            </View>
          )}

          {/* Course Title & Description - Bottom of gradient */}
          <View className="absolute bottom-6 left-6 right-6">
            <Text 
              className="text-white text-3xl font-bold mb-2"
              style={{ textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
            >
              {title}
            </Text>
            <Text 
              className="text-white/90 text-sm font-medium"
              numberOfLines={2}
              style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
            >
              {description || 'Start learning today'}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 py-5">
          {/* Progress Section */}
          {isEnrolled && progress !== undefined && (
            <View className="mb-1">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.round(progress)}% Completed
                </Text>
              </View>
              
              {/* Custom Progress Bar */}
              <View className="flex-row h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <View 
                  className="bg-blue-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <View className="flex-1 bg-gray-300 dark:bg-gray-600" />
              </View>
            </View>
          )}

          {/* Not Enrolled - Show Start Button */}
          {!isEnrolled && (
            <View className="pt-2">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Start Course
              </Text>
              <View className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
