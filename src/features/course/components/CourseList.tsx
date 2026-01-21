import React, { useCallback } from 'react';
import {
  FlatList,
  View,
  RefreshControl,
  type ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CourseCard } from './CourseCard';
import { CourseCardSkeleton } from './CourseCardSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { useInfiniteCourses, useMyEnrollments, useCourseProgress } from '../hooks';
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
      };
    },
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
    ({ item }) => {
      const { isEnrolled } = getEnrollmentInfo(item.courseId);
      return (
        <View className={cn(numColumns === 2 ? 'flex-1 p-1' : 'px-4 py-2')}>
          <CourseCard
            course={item}
            onPress={() => handleCoursePress(item.courseId)}
            isEnrolled={isEnrolled}
          />
        </View>
      );
    },
    [getEnrollmentInfo, handleCoursePress, numColumns],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="p-4">
        <CourseCardSkeleton />
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="px-4 gap-4">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </View>
      );
    }

    return (
      <EmptyState
        title="No courses found"
        description="Check back later for new courses"
        icon={<View><Text className="text-5xl">📚</Text></View>}
      />
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

// Need to import Text for the icon
import { Text } from 'react-native';
