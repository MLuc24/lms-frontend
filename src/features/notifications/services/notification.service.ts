import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { apiClient } from '@/api/client';
import { getDeviceInfo } from '@/shared/utils/device';
import type {
  DeactivatePushTokenRequestDto,
  DeactivatePushTokenResponseDto,
  RegisterPushTokenRequestDto,
  RegisterPushTokenResponseDto,
  SendTestPushResponseDto,
} from '@/types';

// Lazy load notifications to avoid Expo Go errors
let Notifications: any = null;
let Device: any = null;
let isConfigured = false;

function loadNotifications() {
  if (!Notifications) {
    try {
      Notifications = require('expo-notifications');
      Device = require('expo-device');
      
      // Configure notification handler once
      if (!isConfigured && Notifications) {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
        isConfigured = true;
      }
    } catch (error) {
      console.log('[Push] Failed to load expo-notifications');
    }
  }
  return Notifications;
}

// Export for use in other files
export { loadNotifications };

// Check if running in Expo Go
function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

async function ensureNotificationPermission(): Promise<void> {
  if (isExpoGo()) {
    throw new Error('Push notifications are not supported in Expo Go. Please use a development build.');
  }

  const Notif = loadNotifications();
  if (!Notif || !Device) {
    throw new Error('Notifications module not available');
  }

  if (!Device.isDevice) {
    throw new Error('Push notifications only work on physical devices');
  }

  const { status: existingStatus } = await Notif.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notif.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    throw new Error('Notification permission denied');
  }
}

export async function registerPushToken(
  tokenOverride?: string
): Promise<RegisterPushTokenResponseDto> {
  await ensureNotificationPermission();

  const Notif = loadNotifications();
  const token = tokenOverride ?? (await Notif.getExpoPushTokenAsync()).data;
  const deviceInfo = getDeviceInfo();
  
  // Map platform to provider (fcm for Android, apns for iOS)
  const provider = Platform.OS === 'ios' ? 'apns' : 'fcm';
  
  const payload: RegisterPushTokenRequestDto = {
    token,
    provider,
    platform: deviceInfo.platform,
    deviceModel: deviceInfo.deviceModel,
    osVersion: deviceInfo.osVersion,
    appVersion: deviceInfo.appVersion,
    locale: deviceInfo.locale,
  };

  const response = await apiClient.post<RegisterPushTokenResponseDto>(
    '/notification/push-tokens',
    payload
  );
  return response;
}

export async function deactivatePushToken(
  tokenOverride?: string
): Promise<DeactivatePushTokenResponseDto> {
  const Notif = loadNotifications();
  if (!Notif) {
    throw new Error('Notifications module not available');
  }
  
  const token = tokenOverride ?? (await Notif.getExpoPushTokenAsync()).data;
  const payload: DeactivatePushTokenRequestDto = { token };

  const response = await apiClient.post<DeactivatePushTokenResponseDto>(
    '/notification/push-tokens/deactivate',
    payload
  );
  return response;
}

export async function sendTestPush(): Promise<SendTestPushResponseDto> {
  const response = await apiClient.post<SendTestPushResponseDto>(
    '/notification/test',
    {}
  );
  return response;
}
