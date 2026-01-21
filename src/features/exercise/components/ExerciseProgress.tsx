/**
 * ExerciseProgress Component
 * Shows progress bar and exercise counter for lesson player
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '@/shared/components/ProgressBar';

interface ExerciseProgressProps {
  currentIndex: number;
  totalCount: number;
  score: number;
  onClose: () => void;
}

export function ExerciseProgress({
  currentIndex,
  totalCount,
  score,
  onClose,
}: ExerciseProgressProps) {
  const progress = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      {/* Close button */}
      <Pressable
        onPress={onClose}
        className="w-10 h-10 items-center justify-center -ml-2"
        accessibilityRole="button"
        accessibilityLabel="Close lesson"
      >
        <Ionicons name="close" size={24} color="#6B7280" />
      </Pressable>

      {/* Progress bar */}
      <View className="flex-1 mx-3">
        <ProgressBar progress={progress} size="md" color="primary" />
      </View>

      {/* Exercise counter */}
      <Text className="text-sm text-gray-500 dark:text-gray-400 mr-3">
        {currentIndex + 1}/{totalCount}
      </Text>

      {/* Score */}
      <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
        <Ionicons name="star" size={16} color="#F59E0B" />
        <Text className="ml-1 font-semibold text-amber-600 dark:text-amber-400">
          {score}
        </Text>
      </View>
    </View>
  );
}
