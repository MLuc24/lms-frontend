/**
 * ExerciseRenderer Component
 * Renders the appropriate exercise component based on type
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MCQExercise } from './MCQExercise';
import { FillBlankExercise } from './FillBlankExercise';
import { ExerciseType } from '@/types';
import type { ExerciseDetailResponseDto } from '@/types';
import type { UserAnswer, MCQOption, BlankItem } from '../types';

interface ExerciseRendererProps {
  exercise: ExerciseDetailResponseDto;
  onAnswer: (answer: UserAnswer) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  correctAnswers?: Record<string, string>;
  selectedAnswers?: Record<string, string>;
}

export function ExerciseRenderer({
  exercise,
  onAnswer,
  disabled = false,
  showFeedback = false,
  correctAnswers = {},
  selectedAnswers = {},
}: ExerciseRendererProps) {
  const { exerciseType, prompt, items } = exercise;

  // Get question text from prompt
  const question = prompt?.promptText || 'Complete the exercise';
  const questionAssetUrl = prompt?.promptAssetUrl;

  // Render based on exercise type
  switch (exerciseType) {
    case ExerciseType.MCQ:
    case ExerciseType.LISTENING_MCQ: {
      // Convert items to MCQ options
      const firstItem = items[0];
      if (!firstItem?.options) {
        return <UnsupportedExercise type={exerciseType} />;
      }

      const options: MCQOption[] = firstItem.options.map((opt) => ({
        optionId: opt.optionId,
        text: opt.optionText,
        assetUrl: opt.optionAssetUrl,
      }));

      return (
        <MCQExercise
          exerciseItemId={firstItem.exerciseItemId}
          question={question}
          questionAssetUrl={questionAssetUrl}
          options={options}
          onAnswer={onAnswer}
          disabled={disabled}
          showFeedback={showFeedback}
          correctOptionId={correctAnswers[firstItem.exerciseItemId]}
          initialSelectedId={selectedAnswers[firstItem.exerciseItemId]}
        />
      );
    }

    case ExerciseType.FILL_BLANK: {
      // Convert items to blank slots
      const blanks: BlankItem[] = items.map((item) => ({
        itemId: item.exerciseItemId,
        position: item.itemOrder,
        correctAnswer: correctAnswers[item.exerciseItemId],
      }));

      return (
        <FillBlankExercise
          exerciseItemId={exercise.exerciseId}
          sentence={question}
          blanks={blanks}
          onAnswer={onAnswer}
          disabled={disabled}
          showFeedback={showFeedback}
          correctAnswers={correctAnswers}
          initialValues={selectedAnswers}
        />
      );
    }

    case ExerciseType.MATCHING:
    case ExerciseType.REORDER:
    case ExerciseType.TRANSLATION:
    case ExerciseType.SPEAKING:
    case ExerciseType.DICTATION:
    case ExerciseType.WRITING:
      return <ComingSoonExercise type={exerciseType} />;

    default:
      return <UnsupportedExercise type={exerciseType} />;
  }
}

// Placeholder for unsupported exercise types
function UnsupportedExercise({ type }: { type: string }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
        <Ionicons name="help-circle" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">
        Unsupported Exercise
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Exercise type "{type}" is not yet supported.
      </Text>
    </View>
  );
}

// Placeholder for coming soon exercise types
function ComingSoonExercise({ type }: { type: string }) {
  const typeLabels: Record<string, string> = {
    [ExerciseType.MATCHING]: 'Matching',
    [ExerciseType.REORDER]: 'Reorder',
    [ExerciseType.TRANSLATION]: 'Translation',
    [ExerciseType.SPEAKING]: 'Speaking',
    [ExerciseType.DICTATION]: 'Dictation',
    [ExerciseType.WRITING]: 'Writing',
  };

  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-4">
        <Ionicons name="construct" size={32} color="#3B82F6" />
      </View>
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">
        {typeLabels[type] || type} Exercise
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
        This exercise type is coming soon!
      </Text>
    </View>
  );
}
