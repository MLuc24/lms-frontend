/**
 * usePracticeSession Hook
 * Manages practice session lifecycle
 */

import { useState, useCallback } from 'react';
import { practiceService } from '../services/practice.service';
import type {
  StartPracticeSessionResponseDto,
  EndPracticeSessionResponseDto,
} from '@/types';

export const usePracticeSession = () => {
  const [currentSession, setCurrentSession] =
    useState<StartPracticeSessionResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Start a new practice session
   */
  const startSession = useCallback(
    async (lessonId: string, mode: 'learn' | 'review' | 'test' = 'learn') => {
      try {
        setLoading(true);
        setError(null);
        const session = await practiceService.startSession(lessonId, mode);
        setCurrentSession(session);
        return session;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to start session';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * End the current practice session
   */
  const endSession = useCallback(
    async (sessionId?: string): Promise<EndPracticeSessionResponseDto> => {
      const id = sessionId || currentSession?.sessionId;
      if (!id) {
        throw new Error('No active session to end');
      }

      try {
        setLoading(true);
        setError(null);
        const result = await practiceService.endSession(id);
        setCurrentSession(null);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to end session';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentSession]
  );

  /**
   * Clear current session (without calling API)
   */
  const clearSession = useCallback(() => {
    setCurrentSession(null);
    setError(null);
  }, []);

  return {
    currentSession,
    loading,
    error,
    startSession,
    endSession,
    clearSession,
  };
};
