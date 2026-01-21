/**
 * Lesson Player Screen
 * Main lesson experience with exercise rendering and session management
 */

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

// Course hooks
import { useLesson, useCompleteLesson } from '@/features/course/hooks';

// Exercise feature
import {
  useExercises,
  useExerciseDetail,
  useStartSession,
  useStartAttempt,
  useSubmitAnswer,
  useCompleteSession,
  ExerciseRenderer,
  ExerciseProgress,
  SessionResult,
  exerciseKeys,
} from '@/features/exercise';
import type { UserAnswer, SessionResultData } from '@/features/exercise';

// Shared components
import { Button } from '@/shared/components/Button';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

// Types
import { LessonType, SessionMode } from '@/types';
import type { SubmitAnswerResponseDto } from '@/types';

// Lesson type icons config
const lessonTypeConfig: Record<
  LessonType,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  [LessonType.PRACTICE]: { icon: 'fitness', color: '#3B82F6' },
  [LessonType.STORY]: { icon: 'book', color: '#8B5CF6' },
  [LessonType.DIALOGUE]: { icon: 'chatbubbles', color: '#EC4899' },
  [LessonType.TEST]: { icon: 'checkmark-circle', color: '#F59E0B' },
  [LessonType.REVIEW]: { icon: 'refresh', color: '#10B981' },
};

// Session state interface
interface SessionState {
  sessionId: string | null;
  currentExerciseIndex: number;
  currentAttemptId: string | null;
  score: number;
  correctAnswers: Record<string, string>;
  selectedAnswers: Record<string, string>;
  exerciseResults: Array<{ exerciseId: string; isCorrect: boolean; score: number }>;
  showFeedback: boolean;
  isCompleted: boolean;
  startTime: number;
}

const initialSessionState: SessionState = {
  sessionId: null,
  currentExerciseIndex: 0,
  currentAttemptId: null,
  score: 0,
  correctAnswers: {},
  selectedAnswers: {},
  exerciseResults: [],
  showFeedback: false,
  isCompleted: false,
  startTime: Date.now(),
};

export default function LessonPlayerScreen() {
  const { lessonId, courseId } = useLocalSearchParams<{
    lessonId: string;
    courseId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Session state
  const [session, setSession] = useState<SessionState>(initialSessionState);
  const [currentAnswer, setCurrentAnswer] = useState<UserAnswer | null>(null);

  // API hooks
  const { data: lesson, isLoading: lessonLoading } = useLesson(lessonId || '');
  const { data: exercisesData, isLoading: exercisesLoading } = useExercises(lessonId || '');
  
  const exercises = exercisesData?.data || [];
  const currentExercise = exercises[session.currentExerciseIndex];

  // Fetch current exercise detail
  const { data: exerciseDetail, isLoading: detailLoading } = useExerciseDetail(
    currentExercise?.exerciseId || '',
  );

  // Mutations
  const startSessionMutation = useStartSession(lessonId || '');
  const startAttemptMutation = useStartAttempt();
  const submitAnswerMutation = useSubmitAnswer();
  const completeSessionMutation = useCompleteSession();
  const completeLessonMutation = useCompleteLesson(courseId || '');

  // Start session on mount
  useEffect(() => {
    if (lessonId && exercises.length > 0 && !session.sessionId) {
      startSessionMutation.mutate(
        { mode: SessionMode.LEARN },
        {
          onSuccess: (data) => {
            setSession((prev) => ({
              ...prev,
              sessionId: data.sessionId,
              startTime: Date.now(),
            }));
          },
        },
      );
    }
  }, [lessonId, exercises.length, session.sessionId]);

  // Start attempt for current exercise
  useEffect(() => {
    if (session.sessionId && currentExercise && !session.currentAttemptId && !session.showFeedback) {
      startAttemptMutation.mutate(
        {
          sessionId: session.sessionId,
          exerciseId: currentExercise.exerciseId,
        },
        {
          onSuccess: (data) => {
            setSession((prev) => ({
              ...prev,
              currentAttemptId: data.attemptId,
            }));
          },
        },
      );
    }
  }, [session.sessionId, currentExercise?.exerciseId, session.currentAttemptId, session.showFeedback]);

  // Handle close with confirmation
  const handleClose = useCallback(() => {
    Alert.alert(
      'Leave Lesson?',
      'Your progress in this lesson will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ],
    );
  }, [router]);

  // Handle answer selection
  const handleAnswer = useCallback((answer: UserAnswer) => {
    setCurrentAnswer(answer);
    setSession((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [answer.exerciseItemId]: answer.selectedOptionId || answer.submittedText || '',
      },
    }));
  }, []);

  // Handle check/submit answer
  const handleCheckAnswer = useCallback(() => {
    if (!currentAnswer || !session.currentAttemptId) return;

    submitAnswerMutation.mutate(
      {
        attemptId: session.currentAttemptId,
        data: {
          exerciseItemId: currentAnswer.exerciseItemId,
          selectedOptionId: currentAnswer.selectedOptionId,
          submittedText: currentAnswer.submittedText,
          timeSpentSeconds: currentAnswer.timeSpentSeconds,
        },
      },
      {
        onSuccess: (result: SubmitAnswerResponseDto) => {
          const exerciseScore = result.isCorrect ? (currentExercise?.points || 10) : 0;
          
          setSession((prev) => ({
            ...prev,
            showFeedback: true,
            score: prev.score + exerciseScore,
            correctAnswers: result.correctAnswer
              ? { ...prev.correctAnswers, [currentAnswer.exerciseItemId]: result.correctAnswer }
              : prev.correctAnswers,
            exerciseResults: [
              ...prev.exerciseResults,
              {
                exerciseId: currentExercise?.exerciseId || '',
                isCorrect: result.isCorrect,
                score: result.scoreAwarded,
              },
            ],
          }));
        },
      },
    );
  }, [currentAnswer, session.currentAttemptId, currentExercise, submitAnswerMutation]);

  // Handle continue to next exercise
  const handleContinue = useCallback(() => {
    const nextIndex = session.currentExerciseIndex + 1;

    if (nextIndex < exercises.length) {
      // Move to next exercise
      setCurrentAnswer(null);
      setSession((prev) => ({
        ...prev,
        currentExerciseIndex: nextIndex,
        currentAttemptId: null,
        showFeedback: false,
      }));
    } else {
      // Complete session
      setSession((prev) => ({
        ...prev,
        isCompleted: true,
      }));

      // Complete session on backend
      if (session.sessionId) {
        completeSessionMutation.mutate(session.sessionId);
      }
    }
  }, [session, exercises, completeSessionMutation]);

  // Handle finish (after result screen)
  const handleFinish = useCallback(() => {
    // Complete lesson with score
    if (lessonId) {
      const maxScore = exercises.reduce((sum, ex) => sum + (ex.points || 10), 0);
      const percentage = maxScore > 0 ? Math.round((session.score / maxScore) * 100) : 0;
      completeLessonMutation.mutate({ lessonId, score: percentage });
    }

    // Invalidate queries and go back
    queryClient.invalidateQueries({ queryKey: exerciseKeys.byLesson(lessonId || '') });
    router.back();
  }, [lessonId, session.score, exercises, completeLessonMutation, queryClient, router]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setSession(initialSessionState);
    setCurrentAnswer(null);
  }, []);

  // Calculate result data
  const resultData: SessionResultData = useMemo(() => {
    const maxScore = exercises.reduce((sum, ex) => sum + (ex.points || 10), 0);
    const correctCount = session.exerciseResults.filter((r) => r.isCorrect).length;
    const timeSpent = Math.round((Date.now() - session.startTime) / 1000);

    return {
      totalScore: session.score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((session.score / maxScore) * 100) : 0,
      correctCount,
      totalCount: exercises.length,
      timeSpent,
    };
  }, [session, exercises]);

  const config = lesson
    ? lessonTypeConfig[lesson.lessonType] || lessonTypeConfig[LessonType.PRACTICE]
    : lessonTypeConfig[LessonType.PRACTICE];

  // Loading state
  const isLoading = lessonLoading || exercisesLoading;
  
  if (isLoading || !lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="p-4">
          <SkeletonLoader height={8} className="mb-4" />
          <SkeletonLoader height={200} />
        </View>
      </SafeAreaView>
    );
  }

  // No exercises state
  if (exercises.length === 0 && !exercisesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ExerciseProgress
          currentIndex={0}
          totalCount={0}
          score={0}
          onClose={handleClose}
        />
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
            <Ionicons name="document-text" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">
            No Exercises Yet
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-6">
            This lesson doesn't have any exercises available.
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            <Text className="text-blue-600 dark:text-blue-400 font-semibold">Go Back</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Completed state - show result
  if (session.isCompleted) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <SessionResult
          result={resultData}
          onContinue={handleFinish}
          onRetry={handleRetry}
          isLoading={completeLessonMutation.isPending}
        />
      </SafeAreaView>
    );
  }

  // Exercise loading
  if (detailLoading || !exerciseDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ExerciseProgress
          currentIndex={session.currentExerciseIndex}
          totalCount={exercises.length}
          score={session.score}
          onClose={handleClose}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-500 dark:text-gray-400">
            Loading exercise...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header with progress */}
      <ExerciseProgress
        currentIndex={session.currentExerciseIndex}
        totalCount={exercises.length}
        score={session.score}
        onClose={handleClose}
      />

      {/* Lesson info */}
      <View className="px-4 pt-4">
        <View className="flex-row items-center mb-2">
          <View
            className="px-3 py-1.5 rounded-full flex-row items-center"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Ionicons name={config.icon} size={14} color={config.color} />
            <Text className="ml-1.5 text-xs font-medium" style={{ color: config.color }}>
              {lesson.lessonType.charAt(0).toUpperCase() + lesson.lessonType.slice(1)}
            </Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {lesson.title || 'Lesson'}
        </Text>
      </View>

      {/* Exercise content */}
      <View className="flex-1 px-4 pt-6">
        <ExerciseRenderer
          exercise={exerciseDetail}
          onAnswer={handleAnswer}
          disabled={session.showFeedback}
          showFeedback={session.showFeedback}
          correctAnswers={session.correctAnswers}
          selectedAnswers={session.selectedAnswers}
        />
      </View>

      {/* Footer action button */}
      <View className="px-4 pb-4 pt-2">
        {!session.showFeedback ? (
          <Button
            variant="gradient"
            size="lg"
            onPress={handleCheckAnswer}
            disabled={!currentAnswer}
            isLoading={submitAnswerMutation.isPending}
          >
            <Text className="text-white font-semibold text-base">Check</Text>
          </Button>
        ) : (
          <Button
            variant="gradient"
            size="lg"
            onPress={handleContinue}
          >
            <Text className="text-white font-semibold text-base">
              {session.currentExerciseIndex < exercises.length - 1 ? 'Continue' : 'Finish'}
            </Text>
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
