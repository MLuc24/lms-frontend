import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CourseList } from '@/features/course/components';
import { useMyEnrollments, useCourseProgress } from '@/features/course/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LearnScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading, refetch } = useMyEnrollments();

  // Get current/active enrollment
  const activeEnrollment = useMemo(() => {
    return enrollments?.data?.find((e) => e.status === 'ongoing');
  }, [enrollments]);

  const handleCoursePress = useCallback(
    (courseId: string) => {
      router.push(`/course/${courseId}`);
    },
    [router],
  );

  const handleContinueLearning = useCallback(() => {
    if (activeEnrollment) {
      router.push(`/course/${activeEnrollment.courseId}`);
    }
  }, [activeEnrollment, router]);

  const renderHeader = useCallback(
    () => (
      <>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Courses
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400">
            Continue your learning journey
          </Text>
        </View>

        {/* Continue Learning Card (if enrolled) */}
        {activeEnrollment && (
          <View className="px-6 pb-4">
            <ContinueLearningCard
              courseId={activeEnrollment.courseId}
              onPress={handleContinueLearning}
            />
          </View>
        )}

        {/* Stats Row (if has enrollments) */}
        {enrollments?.data && enrollments.data.length > 0 && (
          <View className="flex-row px-6 py-4 gap-3">
            <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
              <Text className="text-blue-600 dark:text-blue-400 text-2xl font-bold mb-1">
                {enrollments.data.length}
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                Courses
              </Text>
            </View>
            <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
              <Text className="text-purple-600 dark:text-purple-400 text-2xl font-bold mb-1">
                {enrollments.data.filter(e => e.status === 'ongoing').length}
              </Text>
              <Text className="text-purple-600 dark:text-purple-400 text-xs font-medium">
                In Progress
              </Text>
            </View>
            <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
              <Text className="text-green-600 dark:text-green-400 text-2xl font-bold mb-1">
                {enrollments.data.filter(e => e.status === 'completed').length}
              </Text>
              <Text className="text-green-600 dark:text-green-400 text-xs font-medium">
                Completed
              </Text>
            </View>
          </View>
        )}

        {/* Section Spacing */}
        <View className="h-4" />
      </>
    ),
    [activeEnrollment, enrollments, handleContinueLearning],
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">📚</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Start Learning
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-6">
            Sign in to access courses and track your progress
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <CourseList
        filters={{ isPublished: true }}
        numColumns={1}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
}

// Continue Learning Card Component
interface ContinueLearningCardProps {
  courseId: string;
  onPress: () => void;
}

function ContinueLearningCard({ courseId, onPress }: ContinueLearningCardProps) {
  const { data: progress } = useCourseProgress(courseId);

  return (
    <Pressable
      onPress={onPress}
      className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 shadow-lg shadow-blue-500/50 active:scale-[0.98]"
    >
      <View className="flex-row items-center mb-4">
        <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center mr-4">
          <Ionicons name="play-circle" size={32} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-white/80 text-sm font-medium mb-1">
            CONTINUE LEARNING
          </Text>
          <Text className="text-white font-bold text-lg">
            Pick up where you left off
          </Text>
        </View>
      </View>

      {progress && (
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white/90 text-sm">
              {progress.completedLessons} of {progress.totalLessons} lessons
            </Text>
            <Text className="text-white font-bold text-sm">
              {progress.progressPercentage}%
            </Text>
          </View>
          
          {/* Progress Bar */}
          <View className="h-2 rounded-full bg-white/20 overflow-hidden">
            <View 
              className="h-full bg-white rounded-full"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
}
