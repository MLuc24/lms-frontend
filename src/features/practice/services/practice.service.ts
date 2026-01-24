/**
 * Practice Service
 * Handles practice session operations
 */

import { apiClient } from '@/api/client';
import type {
  StartPracticeSessionRequestDto,
  StartPracticeSessionResponseDto,
  EndPracticeSessionResponseDto,
} from '@/types';

export const practiceService = {
  /**
   * Start a practice session
   * POST /lessons/:lessonId/practice/start
   */
  async startSession(
    lessonId: string,
    mode: 'learn' | 'review' | 'test' = 'learn'
  ): Promise<StartPracticeSessionResponseDto> {
    const data: StartPracticeSessionRequestDto = { mode };
    return apiClient.post<StartPracticeSessionResponseDto>(
      `/lessons/${lessonId}/practice/start`,
      data
    );
  },

  /**
   * End a practice session
   * PUT /practice-sessions/:sessionId/end
   */
  async endSession(sessionId: string): Promise<EndPracticeSessionResponseDto> {
    return apiClient.put<EndPracticeSessionResponseDto>(
      `/practice-sessions/${sessionId}/end`,
      {}
    );
  },
};
