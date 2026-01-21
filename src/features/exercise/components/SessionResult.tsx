/**
 * SessionResult Component
 * Displays the result summary after completing a practice session
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/shared/components/Button';
import { cn } from '@/shared/utils/cn';
import type { SessionResultData } from '../types';

interface SessionResultProps {
  result: SessionResultData;
  onContinue: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
}

export function SessionResult({
  result,
  onContinue,
  onRetry,
  isLoading = false,
}: SessionResultProps) {
  const { totalScore, maxScore, percentage, correctCount, totalCount, timeSpent } = result;

  // Determine result tier
  const tier = getResultTier(percentage);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <View className="flex-1 items-center justify-center px-6">
      {/* Result icon */}
      <View
        className={cn(
          'w-28 h-28 rounded-full items-center justify-center mb-6',
          tier.bgColor,
        )}
      >
        <Ionicons name={tier.icon} size={56} color={tier.iconColor} />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
        {tier.title}
      </Text>

      {/* Subtitle */}
      <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-6">
        {tier.subtitle}
      </Text>

      {/* Score display */}
      <View className="w-full max-w-[280px] mb-8">
        <LinearGradient
          colors={tier.gradientColors as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-6"
        >
          <View className="items-center">
            <Text className="text-5xl font-bold text-white mb-1">
              {percentage}%
            </Text>
            <Text className="text-white/80">
              {totalScore}/{maxScore} points
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Stats */}
      <View className="flex-row w-full max-w-[320px] mb-8">
        <StatCard
          icon="checkmark-circle"
          iconColor="#22C55E"
          label="Correct"
          value={`${correctCount}/${totalCount}`}
        />
        <View className="w-4" />
        <StatCard
          icon="time"
          iconColor="#3B82F6"
          label="Time"
          value={formatTime(timeSpent)}
        />
      </View>

      {/* Actions */}
      <View className="w-full max-w-[320px] gap-3">
        <Button
          variant="gradient"
          size="lg"
          onPress={onContinue}
          isLoading={isLoading}
        >
          <Text className="text-white font-semibold text-base">Continue</Text>
        </Button>

        {onRetry && percentage < 100 && (
          <Button variant="outline" size="lg" onPress={onRetry}>
            <Ionicons name="refresh" size={18} color="#3B82F6" />
            <Text className="text-blue-600 dark:text-blue-400 font-semibold text-base ml-2">
              Try Again
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
}

// Stat card component
function StatCard({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 items-center">
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text className="text-lg font-bold text-gray-900 dark:text-white mt-2">
        {value}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
    </View>
  );
}

// Result tier configuration
interface ResultTier {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  gradientColors: readonly [string, string, string];
}

function getResultTier(percentage: number): ResultTier {
  if (percentage >= 90) {
    return {
      title: 'Perfect!',
      subtitle: 'Outstanding performance!',
      icon: 'trophy',
      iconColor: '#F59E0B',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      gradientColors: ['#F59E0B', '#D97706', '#B45309'],
    };
  }
  if (percentage >= 70) {
    return {
      title: 'Great Job!',
      subtitle: 'You\'re making excellent progress!',
      icon: 'star',
      iconColor: '#22C55E',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      gradientColors: ['#22C55E', '#16A34A', '#15803D'],
    };
  }
  if (percentage >= 50) {
    return {
      title: 'Good Effort!',
      subtitle: 'Keep practicing to improve!',
      icon: 'thumbs-up',
      iconColor: '#3B82F6',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      gradientColors: ['#3B82F6', '#2563EB', '#1D4ED8'],
    };
  }
  return {
    title: 'Keep Trying!',
    subtitle: 'Practice makes perfect!',
    icon: 'fitness',
    iconColor: '#8B5CF6',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    gradientColors: ['#8B5CF6', '#7C3AED', '#6D28D9'],
  };
}
