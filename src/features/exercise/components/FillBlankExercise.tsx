/**
 * FillBlankExercise Component
 * Fill in the blank exercise type
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/shared/utils/cn';
import type { UserAnswer } from '../types';

interface BlankSlot {
  itemId: string;
  position: number;
  correctAnswer?: string;
}

interface FillBlankExerciseProps {
  exerciseItemId: string;
  sentence: string;
  blanks: BlankSlot[];
  onAnswer: (answer: UserAnswer) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  correctAnswers?: Record<string, string>;
  initialValues?: Record<string, string>;
}

// Parse sentence to find blank positions marked as ___
function parseSentenceWithBlanks(sentence: string, blanks: BlankSlot[]) {
  const parts: Array<{ type: 'text' | 'blank'; content: string; itemId?: string }> = [];
  const blankPattern = /_{3,}/g;
  let lastIndex = 0;
  let blankIndex = 0;
  let match;

  while ((match = blankPattern.exec(sentence)) !== null) {
    // Add text before blank
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: sentence.slice(lastIndex, match.index) });
    }
    
    // Add blank
    const blank = blanks[blankIndex];
    if (blank) {
      parts.push({ type: 'blank', content: '', itemId: blank.itemId });
      blankIndex++;
    }
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < sentence.length) {
    parts.push({ type: 'text', content: sentence.slice(lastIndex) });
  }

  return parts;
}

export function FillBlankExercise({
  exerciseItemId,
  sentence,
  blanks,
  onAnswer,
  disabled = false,
  showFeedback = false,
  correctAnswers = {},
  initialValues = {},
}: FillBlankExerciseProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [startTime] = useState(Date.now());
  const inputRefs = useRef<Record<string, TextInput | null>>({});

  // Reset values when exercise changes
  useEffect(() => {
    setValues(initialValues);
  }, [exerciseItemId, initialValues]);

  const parts = parseSentenceWithBlanks(sentence, blanks);

  const handleChange = useCallback(
    (itemId: string, text: string) => {
      if (disabled) return;

      const newValues = { ...values, [itemId]: text };
      setValues(newValues);
    },
    [values, disabled],
  );

  const handleSubmitBlank = useCallback(
    (itemId: string) => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      onAnswer({
        exerciseItemId: itemId,
        submittedText: values[itemId] || '',
        timeSpentSeconds: timeSpent,
      });
    },
    [values, onAnswer, startTime],
  );

  const getInputStyle = (itemId: string) => {
    if (!showFeedback) {
      return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
    }

    const userValue = values[itemId]?.toLowerCase().trim();
    const correct = correctAnswers[itemId]?.toLowerCase().trim();
    
    if (userValue === correct) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/30';
    }
    return 'border-red-500 bg-red-50 dark:bg-red-900/30';
  };

  const getInputIcon = (itemId: string) => {
    if (!showFeedback) return null;

    const userValue = values[itemId]?.toLowerCase().trim();
    const correct = correctAnswers[itemId]?.toLowerCase().trim();

    if (userValue === correct) {
      return <Ionicons name="checkmark-circle" size={20} color="#22C55E" />;
    }
    return <Ionicons name="close-circle" size={20} color="#EF4444" />;
  };

  return (
    <View className="flex-1">
      {/* Instructions */}
      <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Fill in the blanks with the correct words
      </Text>

      {/* Sentence with blanks */}
      <View className="flex-row flex-wrap items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <Text
                key={`text-${index}`}
                className="text-lg text-gray-900 dark:text-white leading-loose"
              >
                {part.content}
              </Text>
            );
          }

          // Blank input
          const itemId = part.itemId!;
          return (
            <View
              key={`blank-${itemId}`}
              className="flex-row items-center mx-1"
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[itemId] = ref;
                }}
                value={values[itemId] || ''}
                onChangeText={(text) => handleChange(itemId, text)}
                onBlur={() => handleSubmitBlank(itemId)}
                onSubmitEditing={() => handleSubmitBlank(itemId)}
                editable={!disabled}
                placeholder="..."
                placeholderTextColor="#9CA3AF"
                className={cn(
                  'min-w-[80px] px-3 py-2 border-2 rounded-lg',
                  'text-base text-center text-gray-900 dark:text-white',
                  getInputStyle(itemId),
                )}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {getInputIcon(itemId)}
            </View>
          );
        })}
      </View>

      {/* Correct answers hint (when showing feedback) */}
      {showFeedback && Object.keys(correctAnswers).length > 0 && (
        <View className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <Text className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Correct answers:
          </Text>
          {blanks.map((blank, index) => (
            <Text
              key={blank.itemId}
              className="text-base text-green-700 dark:text-green-400"
            >
              {index + 1}. {correctAnswers[blank.itemId] || blank.correctAnswer}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
