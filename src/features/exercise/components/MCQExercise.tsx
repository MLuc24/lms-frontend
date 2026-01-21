/**
 * MCQExercise Component
 * Multiple Choice Question exercise type
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/shared/utils/cn';
import { getMediaUrl } from '@/shared/utils/media';
import type { MCQOption, UserAnswer } from '../types';

interface MCQExerciseProps {
  exerciseItemId: string;
  question: string;
  questionAssetUrl?: string;
  options: MCQOption[];
  onAnswer: (answer: UserAnswer) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  correctOptionId?: string;
  initialSelectedId?: string;
}

export function MCQExercise({
  exerciseItemId,
  question,
  questionAssetUrl,
  options,
  onAnswer,
  disabled = false,
  showFeedback = false,
  correctOptionId,
  initialSelectedId,
}: MCQExerciseProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
  const [startTime] = useState(Date.now());

  // Reset selection when exercise changes
  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [exerciseItemId, initialSelectedId]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (disabled) return;
      
      setSelectedId(optionId);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      onAnswer({
        exerciseItemId,
        selectedOptionId: optionId,
        timeSpentSeconds: timeSpent,
      });
    },
    [exerciseItemId, onAnswer, disabled, startTime],
  );

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedId === optionId;
    const isCorrect = correctOptionId === optionId;

    if (!showFeedback) {
      return isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    }

    // With feedback
    if (isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/30';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/30';
    }
    return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-50';
  };

  const getOptionIcon = (optionId: string) => {
    if (!showFeedback) return null;
    
    const isCorrect = correctOptionId === optionId;
    const isSelected = selectedId === optionId;

    if (isCorrect) {
      return <Ionicons name="checkmark-circle" size={24} color="#22C55E" />;
    }
    if (isSelected && !isCorrect) {
      return <Ionicons name="close-circle" size={24} color="#EF4444" />;
    }
    return null;
  };

  const imageUrl = getMediaUrl(questionAssetUrl);

  return (
    <View className="flex-1">
      {/* Question */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
          {question}
        </Text>
        
        {/* Question image if exists */}
        {imageUrl && (
          <View className="mt-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-48"
              resizeMode="contain"
              accessibilityLabel="Question image"
            />
          </View>
        )}
      </View>

      {/* Options */}
      <View className="gap-3">
        {options.map((option, index) => {
          const optionImageUrl = getMediaUrl(option.assetUrl);
          const letterLabel = String.fromCharCode(65 + index); // A, B, C, D...

          return (
            <Pressable
              key={option.optionId}
              onPress={() => handleSelect(option.optionId)}
              disabled={disabled}
              className={cn(
                'flex-row items-center p-4 rounded-xl border-2',
                'active:scale-[0.98] transition-transform',
                getOptionStyle(option.optionId),
              )}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedId === option.optionId }}
              accessibilityLabel={`Option ${letterLabel}: ${option.text}`}
            >
              {/* Option letter */}
              <View
                className={cn(
                  'w-8 h-8 rounded-full items-center justify-center mr-3',
                  selectedId === option.optionId
                    ? 'bg-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700',
                )}
              >
                <Text
                  className={cn(
                    'font-bold',
                    selectedId === option.optionId
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  {letterLabel}
                </Text>
              </View>

              {/* Option content */}
              <View className="flex-1">
                {optionImageUrl ? (
                  <Image
                    source={{ uri: optionImageUrl }}
                    className="w-full h-24 rounded-lg"
                    resizeMode="contain"
                  />
                ) : (
                  <Text className="text-base text-gray-800 dark:text-gray-200">
                    {option.text}
                  </Text>
                )}
              </View>

              {/* Feedback icon */}
              {getOptionIcon(option.optionId)}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
