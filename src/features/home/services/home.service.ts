/**
 * Home Service
 * Handles dashboard home data fetching
 */

import { apiClient } from '@/api/client';
import type { HomeContinueResponseDto, HomeSummaryResponseDto } from '@/types';

export const homeService = {
  /**
   * Get dashboard summary
   * GET /home/summary
   */
  async getSummary(): Promise<HomeSummaryResponseDto> {
    return apiClient.get<HomeSummaryResponseDto>('/home/summary');
  },

  /**
   * Get continue learning card data
   * GET /home/continue
   */
  async getContinue(): Promise<HomeContinueResponseDto> {
    return apiClient.get<HomeContinueResponseDto>('/home/continue');
  },
};
