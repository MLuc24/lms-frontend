/**
 * Course Store
 * Zustand store for course/learning UI state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LearningSession {
  courseId: string;
  lessonId: string;
  exerciseIndex: number;
  score: number;
  startedAt: string;
}

interface CourseState {
  // Current learning context
  currentCourseId: string | null;
  currentLessonId: string | null;
  
  // Active learning session
  activeSession: LearningSession | null;
  
  // Offline progress cache
  pendingCompletions: Array<{
    lessonId: string;
    score: number;
    completedAt: string;
  }>;
  
  // User preferences
  preferredLanguageId: number;
  
  // Actions
  setCurrentCourse: (courseId: string | null) => void;
  setCurrentLesson: (lessonId: string | null) => void;
  startSession: (courseId: string, lessonId: string) => void;
  updateSession: (updates: Partial<LearningSession>) => void;
  endSession: () => void;
  addPendingCompletion: (lessonId: string, score: number) => void;
  removePendingCompletion: (lessonId: string) => void;
  clearPendingCompletions: () => void;
  setPreferredLanguageId: (languageId: number) => void;
  reset: () => void;
}

const initialState = {
  currentCourseId: null,
  currentLessonId: null,
  activeSession: null,
  pendingCompletions: [],
  preferredLanguageId: 1, // Default to English
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentCourse: (courseId) => {
        set({ currentCourseId: courseId });
      },

      setCurrentLesson: (lessonId) => {
        set({ currentLessonId: lessonId });
      },

      startSession: (courseId, lessonId) => {
        set({
          currentCourseId: courseId,
          currentLessonId: lessonId,
          activeSession: {
            courseId,
            lessonId,
            exerciseIndex: 0,
            score: 0,
            startedAt: new Date().toISOString(),
          },
        });
      },

      updateSession: (updates) => {
        const { activeSession } = get();
        if (activeSession) {
          set({
            activeSession: { ...activeSession, ...updates },
          });
        }
      },

      endSession: () => {
        set({
          activeSession: null,
          currentLessonId: null,
        });
      },

      addPendingCompletion: (lessonId, score) => {
        set((state) => ({
          pendingCompletions: [
            ...state.pendingCompletions.filter((p) => p.lessonId !== lessonId),
            {
              lessonId,
              score,
              completedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      removePendingCompletion: (lessonId) => {
        set((state) => ({
          pendingCompletions: state.pendingCompletions.filter(
            (p) => p.lessonId !== lessonId,
          ),
        }));
      },

      clearPendingCompletions: () => {
        set({ pendingCompletions: [] });
      },

      setPreferredLanguageId: (languageId) => {
        set({ preferredLanguageId: languageId });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferredLanguageId: state.preferredLanguageId,
        pendingCompletions: state.pendingCompletions,
      }),
    },
  ),
);

// Selectors
export const selectCurrentCourse = (state: CourseState) => state.currentCourseId;
export const selectCurrentLesson = (state: CourseState) => state.currentLessonId;
export const selectActiveSession = (state: CourseState) => state.activeSession;
export const selectPendingCompletions = (state: CourseState) => state.pendingCompletions;
export const selectPreferredLanguageId = (state: CourseState) => state.preferredLanguageId;
