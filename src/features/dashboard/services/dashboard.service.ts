/**
 * Dashboard Service
 * Handles progress, review, streak data for dashboard screens
 */

import { apiClient } from '@/api/client';
import type {
  ProgressTodayResponseDto,
  ProgressWeeklyResponseDto,
  ReviewQueueResponseDto,
  ReviewSummaryResponseDto,
  StreakResponseDto,
} from '@/types';

export interface ProgressTodayParams {
  date?: string;
  timeZone?: string;
}

export interface ProgressWeeklyParams {
  weekStart?: string;
  timeZone?: string;
}

export interface ReviewQueueParams {
  page?: number;
  limit?: number;
  dueBefore?: string;
}

export const dashboardService = {
  /**
   * Get today's progress
   * GET /progress/today
   */
  async getProgressToday(params?: ProgressTodayParams): Promise<ProgressTodayResponseDto> {
    const queryString = params?.date ? `?date=${encodeURIComponent(params.date)}` : '';
    return apiClient.get<ProgressTodayResponseDto>(`/progress/today${queryString}`, {
      headers: params?.timeZone ? { 'x-timezone': params.timeZone } : undefined,
    });
  },

  /**
   * Get weekly progress
   * GET /progress/weekly
   */
  async getProgressWeekly(
    params?: ProgressWeeklyParams,
  ): Promise<ProgressWeeklyResponseDto> {
    const queryString = params?.weekStart
      ? `?weekStart=${encodeURIComponent(params.weekStart)}`
      : '';
    return apiClient.get<ProgressWeeklyResponseDto>(`/progress/weekly${queryString}`, {
      headers: params?.timeZone ? { 'x-timezone': params.timeZone } : undefined,
    });
  },

  /**
   * Get streak summary
   * GET /streak
   */
  async getStreak(timeZone?: string): Promise<StreakResponseDto> {
    return apiClient.get<StreakResponseDto>('/streak', {
      headers: timeZone ? { 'x-timezone': timeZone } : undefined,
    });
  },

  /**
   * Get review summary
   * GET /review/summary
   */
  async getReviewSummary(timeZone?: string): Promise<ReviewSummaryResponseDto> {
    return apiClient.get<ReviewSummaryResponseDto>('/review/summary', {
      headers: timeZone ? { 'x-timezone': timeZone } : undefined,
    });
  },

  /**
   * Get review queue
   * GET /review/queue
   */
  async getReviewQueue(params?: ReviewQueueParams): Promise<ReviewQueueResponseDto> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.dueBefore) query.append('dueBefore', params.dueBefore);
    const queryString = query.toString();
    return apiClient.get<ReviewQueueResponseDto>(
      `/review/queue${queryString ? `?${queryString}` : ''}`,
    );
  },
};
