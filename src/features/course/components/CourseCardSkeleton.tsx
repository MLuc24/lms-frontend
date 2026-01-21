import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { Card } from '@/shared/components/Card';

export function CourseCardSkeleton() {
  return (
    <Card padding="none" shadow="md" className="overflow-hidden">
      {/* Thumbnail skeleton */}
      <SkeletonLoader variant="thumbnail" />

      {/* Content skeleton */}
      <View className="p-4 gap-2">
        {/* Badges row */}
        <View className="flex-row gap-2">
          <SkeletonLoader width={60} height={20} rounded="full" />
          <SkeletonLoader width={50} height={20} rounded="full" />
        </View>

        {/* Title */}
        <SkeletonLoader width="80%" height={24} />

        {/* Description */}
        <SkeletonLoader width="100%" height={16} />
        <SkeletonLoader width="60%" height={16} />

        {/* Progress bar */}
        <View className="mt-2">
          <SkeletonLoader width="100%" height={8} />
        </View>
      </View>
    </Card>
  );
}
