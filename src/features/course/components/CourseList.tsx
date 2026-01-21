import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  RefreshControl,
  type ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatedCourseCard } from './AnimatedCourseCard';
import { CourseCardSkeleton } from './CourseCardSkeleton';
import { useInfiniteCourses, useMyEnrollments } from '../hooks';
import type { CourseResponseDto, CourseQueryParams } from '@/types';
import { cn } from '@/shared/utils/cn';

interface CourseListProps {
  /** Query filters */
  filters?: Omit<CourseQueryParams, 'page'>;
  /** Number of columns */
  numColumns?: 1 | 2;
  /** Custom class */
  className?: string;
  /** Header component */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function CourseList({
  filters,
  numColumns = 1,
  className,
  ListHeaderComponent,
}: CourseListProps) {
  const router = useRouter();
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCourses(filters);

  const { data: enrollments } = useMyEnrollments();

  // Flatten pages into single array
  const courses = data?.pages.flatMap((page) => page.data) ?? [];

  // Get enrollment info for a course
  const getEnrollmentInfo = useCallback(
    (courseId: string) => {
      const enrollment = enrollments?.data?.find(
        (e) => e.courseId === courseId,
      );
      return {
        isEnrolled: !!enrollment,
        enrollmentId: enrollment?.enrollmentId,
        status: enrollment?.status,
      };
    },
    [enrollments],
  );

  // Memoize enrolled course IDs for progress fetching
  const enrolledCourseIds = useMemo(
    () => enrollments?.data?.map((e) => e.courseId) ?? [],
    [enrollments],
  );

  const handleCoursePress = useCallback(
    (courseId: string) => {
      router.push(`/course/${courseId}`);
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem: ListRenderItem<CourseResponseDto> = useCallback(
    ({ item, index }) => {
      const { isEnrolled, status } = getEnrollmentInfo(item.courseId);
      
      // Determine status badge
      let cardStatus: 'in-progress' | 'new' | 'completed' | undefined;
      if (isEnrolled) {
        if (status === 'completed') {
          cardStatus = 'completed';
        } else if (status === 'ongoing') {
          cardStatus = 'in-progress';
        }
      } else if (index < 3) {
        // Mark first 3 non-enrolled as "new"
        cardStatus = 'new';
      }

      return (
        <View className={cn(numColumns === 2 ? 'flex-1 px-2 py-2' : 'px-6 py-3')}>
          <AnimatedCourseCard
            course={item}
            index={index}
            onPress={() => handleCoursePress(item.courseId)}
            isEnrolled={isEnrolled}
            status={cardStatus}
          />
        </View>
      );
    },
    [getEnrollmentInfo, handleCoursePress, numColumns],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="px-6 py-3">
        <CourseCardSkeleton />
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="px-6 gap-6 py-4">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-8 py-12">
        <Text className="text-6xl mb-4">📚</Text>
        <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          No courses found
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
          Check back later for new courses
        </Text>
      </View>
    );
  }, [isLoading]);

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.courseId}
      renderItem={renderItem}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      className={cn('flex-1', className)}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
}
