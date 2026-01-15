import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiClient } from '@/api/client';
import { getDeviceInfo } from '@/shared/utils/device';
import type {
  DeactivatePushTokenRequestDto,
  DeactivatePushTokenResponseDto,
  RegisterPushTokenRequestDto,
  RegisterPushTokenResponseDto,
  SendTestPushResponseDto,
} from '@/types';

async function ensureNotificationPermission(): Promise<void> {
  if (!Device.isDevice) {
    throw new Error('Push notifications only work on physical devices');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
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

  const token = tokenOverride ?? (await Notifications.getExpoPushTokenAsync()).data;
  const deviceInfo = getDeviceInfo();
  const tokenSuffix = token.slice(-6);
  console.log('[Push] Registering token', {
    suffix: tokenSuffix,
    platform: deviceInfo.platform,
  });

  const payload: RegisterPushTokenRequestDto = {
    token,
    provider: 'expo',
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
  console.log('[Push] Token registered', response);
  return response;
}

export async function deactivatePushToken(
  tokenOverride?: string
): Promise<DeactivatePushTokenResponseDto> {
  const token = tokenOverride ?? (await Notifications.getExpoPushTokenAsync()).data;
  const tokenSuffix = token.slice(-6);
  console.log('[Push] Deactivating token', { suffix: tokenSuffix });
  const payload: DeactivatePushTokenRequestDto = { token };

  const response = await apiClient.post<DeactivatePushTokenResponseDto>(
    '/notification/push-tokens/deactivate',
    payload
  );
  console.log('[Push] Token deactivated', response);
  return response;
}

export async function sendTestPush(): Promise<SendTestPushResponseDto> {
  console.log('[Push] Sending test notification');
  const response = await apiClient.post<SendTestPushResponseDto>(
    '/notification/test',
    {}
  );
  console.log('[Push] Test notification response', response);
  return response;
}
