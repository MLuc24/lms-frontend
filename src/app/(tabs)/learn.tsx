import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CourseList } from '@/features/course/components';
import { useMyEnrollments, useCourseProgress } from '@/features/course/hooks';
import { PressableCard } from '@/shared/components/Card';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { Badge } from '@/shared/components/Badge';
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
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Learn
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 mt-1">
            Continue your learning journey
          </Text>
        </View>

        {/* Continue Learning Card (if enrolled) */}
        {activeEnrollment && (
          <View className="px-4 py-2">
            <ContinueLearningCard
              courseId={activeEnrollment.courseId}
              onPress={handleContinueLearning}
            />
          </View>
        )}

        {/* My Courses Section */}
        {enrollments?.data && enrollments.data.length > 0 && (
          <View className="mt-4">
            <View className="flex-row items-center justify-between px-4 mb-2">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                My Courses
              </Text>
              <Badge variant="primary" size="sm">
                {enrollments.data.length}
              </Badge>
            </View>
          </View>
        )}

        {/* All Courses Header */}
        <View className="mt-4 px-4 mb-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Explore Courses
          </Text>
        </View>
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
    <PressableCard
      onPress={onPress}
      padding="md"
      shadow="md"
      className="bg-gradient-to-r from-blue-500 to-blue-600"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
          <Text className="text-2xl">🎯</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            Continue Learning
          </Text>
          {progress && (
            <View className="mt-2">
              <ProgressBar
                progress={progress.progressPercentage}
                size="sm"
                color="success"
              />
              <Text className="text-white/80 text-xs mt-1">
                {progress.completedLessons}/{progress.totalLessons} lessons completed
              </Text>
            </View>
          )}
        </View>
      </View>
    </PressableCard>
  );
}
