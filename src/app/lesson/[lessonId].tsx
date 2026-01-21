import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLesson, useCompleteLesson } from '@/features/course/hooks';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { Button } from '@/shared/components/Button';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { cn } from '@/shared/utils/cn';
import { LessonType } from '@/types';

// Lesson type icons
const lessonTypeConfig: Record<LessonType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  [LessonType.PRACTICE]: { icon: 'fitness', color: '#3B82F6' },
  [LessonType.STORY]: { icon: 'book', color: '#8B5CF6' },
  [LessonType.DIALOGUE]: { icon: 'chatbubbles', color: '#EC4899' },
  [LessonType.TEST]: { icon: 'checkmark-circle', color: '#F59E0B' },
  [LessonType.REVIEW]: { icon: 'refresh', color: '#10B981' },
};

export default function LessonPlayerScreen() {
  const { lessonId, courseId } = useLocalSearchParams<{
    lessonId: string;
    courseId: string;
  }>();
  const router = useRouter();

  // State
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch lesson
  const { data: lesson, isLoading } = useLesson(lessonId || '');

  // Complete lesson mutation
  const completeMutation = useCompleteLesson(courseId || '');

  // Placeholder: Total exercises (would come from exercises API)
  const totalExercises = 5;
  const progress = ((currentExercise + 1) / totalExercises) * 100;

  const handleClose = useCallback(() => {
    Alert.alert(
      'Leave Lesson?',
      'Your progress in this lesson will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ],
    );
  }, [router]);

  const handleNextExercise = useCallback(() => {
    if (currentExercise < totalExercises - 1) {
      // Simulate correct answer
      setScore((prev) => prev + 20);
      setCurrentExercise((prev) => prev + 1);
    } else {
      // Complete lesson
      const finalScore = score + 20;
      setScore(finalScore);
      setIsCompleted(true);

      if (lessonId) {
        completeMutation.mutate({ lessonId, score: finalScore });
      }
    }
  }, [currentExercise, totalExercises, score, lessonId, completeMutation]);

  const handleFinish = useCallback(() => {
    router.back();
  }, [router]);

  const config = lesson
    ? lessonTypeConfig[lesson.lessonType] || lessonTypeConfig[LessonType.PRACTICE]
    : lessonTypeConfig[LessonType.PRACTICE];

  // Loading state
  if (isLoading || !lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="p-4">
          <SkeletonLoader height={8} className="mb-4" />
          <SkeletonLoader height={200} />
        </View>
      </SafeAreaView>
    );
  }

  // Completed state
  if (isCompleted) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-6">
            <Ionicons name="checkmark" size={48} color="#22C55E" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Lesson Complete!
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 text-center mb-2">
            Great job!
          </Text>
          <View className="bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-8">
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {score}%
            </Text>
          </View>

          <Button variant="gradient" size="lg" onPress={handleFinish}>
            <Text className="text-white font-semibold text-base">Continue</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        {/* Close button */}
        <Pressable
          onPress={handleClose}
          className="w-10 h-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </Pressable>

        {/* Progress bar */}
        <View className="flex-1 mx-4">
          <ProgressBar progress={progress} size="md" color="primary" />
        </View>

        {/* Score */}
        <View className="flex-row items-center">
          <Ionicons name="star" size={18} color="#F59E0B" />
          <Text className="ml-1 font-semibold text-gray-700 dark:text-gray-300">
            {score}
          </Text>
        </View>
      </View>

      {/* Lesson content */}
      <View className="flex-1 px-4 pt-8">
        {/* Lesson type badge */}
        <View className="flex-row items-center mb-4">
          <View
            className="px-3 py-1.5 rounded-full flex-row items-center"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Ionicons name={config.icon} size={16} color={config.color} />
            <Text
              className="ml-1.5 text-sm font-medium"
              style={{ color: config.color }}
            >
              {lesson.lessonType.charAt(0).toUpperCase() + lesson.lessonType.slice(1)}
            </Text>
          </View>
        </View>

        {/* Lesson title */}
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {lesson.title || 'Lesson'}
        </Text>

        {/* Intro text */}
        {lesson.introText && (
          <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
            {lesson.introText}
          </Text>
        )}

        {/* Exercise placeholder */}
        <View className="flex-1 items-center justify-center">
          <View className="w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
              Exercise {currentExercise + 1} of {totalExercises}
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
              Exercise content will appear here.
              {'\n'}
              This is a placeholder for the actual exercise component.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer with action button */}
      <View className="px-4 pb-4 pt-2">
        <Button
          variant="gradient"
          size="lg"
          onPress={handleNextExercise}
          isLoading={completeMutation.isPending}
        >
          <Text className="text-white font-semibold text-base">
            {currentExercise < totalExercises - 1 ? 'Continue' : 'Complete'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
