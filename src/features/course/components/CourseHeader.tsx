import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { CourseHeroImage } from './CourseHeroImage';
import { cn } from '@/shared/utils/cn';
import type { CourseResponseDto, CourseProgressResponseDto, EnrollmentResponseDto } from '@/types';
import { EnrollmentStatus } from '@/types';

interface CourseHeaderProps {
  /** Course data */
  course: CourseResponseDto;
  /** Enrollment data (if enrolled) */
  enrollment?: EnrollmentResponseDto;
  /** Progress data (if enrolled) */
  progress?: CourseProgressResponseDto;
  /** Enroll loading state */
  isEnrolling?: boolean;
  /** Enroll handler */
  onEnroll?: () => void;
  /** Continue learning handler */
  onContinue?: () => void;
  /** View all units handler */
  onViewAllUnits?: () => void;
  /** Whether content is visible */
  isContentVisible?: boolean;
  /** Custom class */
  className?: string;
}

const levelLabels: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: 'Beginner', color: '#10B981', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  2: { label: 'Intermediate', color: '#F59E0B', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  3: { label: 'Advanced', color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
};

export function CourseHeader({
  course,
  enrollment,
  progress,
  isEnrolling,
  onEnroll,
  onContinue,
  onViewAllUnits,
  isContentVisible = false,
  className,
}: CourseHeaderProps) {
  const title = course.title || 'Untitled Course';
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === EnrollmentStatus.COMPLETED;

  // Calculate stats
  const totalLessons = progress?.totalLessons || 24;
  const completedLessons = progress?.completedLessons || 0;
  const estimatedHours = Math.ceil((totalLessons * 30) / 60);
  const progressPercentage = progress?.progressPercentage || 0;

  const levelConfig = levelLabels[course.levelId] || levelLabels[1];

  return (
    <View className={cn('bg-white dark:bg-gray-900', className)}>
      {/* Hero Image Section */}
      <View className="px-4 pt-4">
        <Animated.View 
          entering={FadeInUp.duration(600).springify()}
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <CourseHeroImage
            courseId={course.courseId}
            source={course.coverUrl}
            height={280}
          />
          
          {/* Floating level badge on hero */}
          <View className="absolute top-4 right-4">
            <View 
              className={cn(
                "px-4 py-2 rounded-full backdrop-blur-xl",
                levelConfig.bgColor
              )}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <Text 
                className="text-sm font-bold"
                style={{ color: levelConfig.color }}
              >
                {levelConfig.label}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Content Section */}
      <View className="px-6 pt-6 pb-5">
        {/* Course Title */}
        <Animated.Text 
          entering={FadeInDown.delay(200).duration(600)}
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: 8,
            lineHeight: 36,
          }}
        >
          {title}
        </Animated.Text>

        {/* Quick Stats Row */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          className="flex-row gap-3 mb-6"
        >
          {/* Lessons Card */}
          <View className="flex-1 rounded-2xl overflow-hidden">
            <LinearGradient
              colors={['#EFF6FF', '#DBEAFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ 
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View 
                className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="book" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Lessons
                </Text>
                <Text className="text-lg font-black text-blue-700">
                  {totalLessons}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Duration Card */}
          <View className="flex-1 rounded-2xl overflow-hidden">
            <LinearGradient
              colors={['#F5F3FF', '#EDE9FE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ 
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View 
                className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
                style={{
                  shadowColor: '#8B5CF6',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="time" size={18} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Duration
                </Text>
                <Text className="text-lg font-black text-purple-700">
                  {estimatedHours}h
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Progress Section (if enrolled) */}
        {isEnrolled && (
          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)}
            style={{ marginBottom: 24 }}
          >
            {/* Stats Grid */}
            <View className="flex-row gap-3 mb-4">
              {/* Circular Progress Card */}
              <View className="flex-1 rounded-2xl overflow-hidden">
                <LinearGradient
                  colors={['#EFF6FF', '#DBEAFE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ 
                    flex: 1,
                    padding: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View className="relative items-center justify-center mb-3">
                    {/* Circular background with shadow */}
                    <View 
                      className="w-24 h-24 rounded-full bg-white items-center justify-center"
                      style={{
                        shadowColor: '#3B82F6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Text className="text-3xl font-black text-blue-600">
                        {progressPercentage}
                        <Text className="text-lg">%</Text>
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Complete
                  </Text>
                </LinearGradient>
              </View>

              {/* Stats Column */}
              <View className="flex-1 gap-3">
                {/* Completed Lessons Card */}
                <View className="flex-1 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={['#ECFDF5', '#D1FAE5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ 
                      flex: 1,
                      padding: 12,
                      justifyContent: 'center',
                    }}
                  >
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                      <Text className="text-xs font-semibold text-emerald-700 ml-1.5">
                        Completed
                      </Text>
                    </View>
                    <Text className="text-2xl font-black text-emerald-600">
                      {completedLessons}
                      <Text className="text-sm font-semibold text-emerald-500">
                        /{totalLessons}
                      </Text>
                    </Text>
                  </LinearGradient>
                </View>

                {/* Streak Card */}
                <View className="flex-1 rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={['#FFFBEB', '#FEF3C7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ 
                      flex: 1,
                      padding: 12,
                      justifyContent: 'center',
                    }}
                  >
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="flame" size={18} color="#F59E0B" />
                      <Text className="text-xs font-semibold text-amber-700 ml-1.5">
                        Streak
                      </Text>
                    </View>
                    <Text className="text-2xl font-black text-amber-600">
                      7
                      <Text className="text-sm font-semibold text-amber-500">
                        {' '}days
                      </Text>
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <Animated.View
                entering={FadeInDown.delay(500).duration(800)}
                style={{ 
                  width: `${progressPercentage}%`,
                  height: '100%',
                  borderRadius: 9999,
                }}
              >
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6'] as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1, borderRadius: 9999 }}
                />
              </Animated.View>
            </View>
          </Animated.View>
        )}

        {/* CTA Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(isEnrolled ? 500 : 400).duration(600)}
          style={{ gap: 12 }}
        >
          {isEnrolled ? (
            <React.Fragment>
              {/* Continue Learning Button */}
              <Pressable
                onPress={onContinue}
                className="overflow-hidden rounded-2xl shadow-lg active:scale-98"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6'] as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ 
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="play-circle" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-3">
                      {isCompleted ? 'Review Course' : 'Continue Learning'}
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* View Course Content Button */}
              <Pressable
                onPress={onViewAllUnits}
                className="py-4 items-center active:opacity-70"
              >
                <View className="flex-row items-center">
                  <Text className="text-blue-600 dark:text-blue-400 font-bold text-base mr-2">
                    {isContentVisible ? 'Hide' : 'View'} Course Content
                  </Text>
                  <Ionicons 
                    name={isContentVisible ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#3B82F6" 
                  />
                </View>
              </Pressable>
            </React.Fragment>
          ) : (
            /* Start Learning Button - Not Enrolled */
            <Pressable
              onPress={onEnroll}
              disabled={isEnrolling}
              className={cn(
                "overflow-hidden rounded-2xl shadow-lg active:scale-98",
                isEnrolling && "opacity-60"
              )}
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ 
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                }}
              >
                <View className="flex-row items-center justify-center">
                  {isEnrolling ? (
                    <Text className="text-white font-bold text-lg">Enrolling...</Text>
                  ) : (
                    <React.Fragment>
                      <Ionicons name="rocket" size={24} color="white" />
                      <Text className="text-white font-bold text-lg ml-3">
                        Start Learning Now
                      </Text>
                    </React.Fragment>
                  )}
                </View>
              </LinearGradient>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
