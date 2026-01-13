/**
 * Device Information Utility
 * Collects device metadata for authentication
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Localization from 'expo-localization';

export interface DeviceInfo {
  platform: 'ios' | 'android';
  deviceModel?: string;
  osVersion?: string;
  appVersion: string;
  locale: string;
}

/**
 * Get current device information
 * Safely collects device metadata with fallbacks
 */
export const getDeviceInfo = (): DeviceInfo => {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';

  // Safely get locale with fallback
  let locale = 'en-US';
  try {
    locale = Localization.getLocales()[0]?.languageTag || 'en-US';
  } catch (error) {
    console.warn('Failed to get locale:', error);
  }

  // Get OS version
  let osVersion: string | undefined;
  try {
    osVersion = Platform.Version?.toString();
  } catch (error) {
    console.warn('Failed to get OS version:', error);
  }

  return {
    platform,
    deviceModel: Constants.deviceName || undefined,
    osVersion,
    appVersion: Constants.expoConfig?.version || '1.0.0',
    locale,
  };
};
