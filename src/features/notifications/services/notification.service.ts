import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
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
  if (Platform.OS === 'android' && typeof Platform.Version === 'number') {
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Notification permission denied');
      }
    }
    return;
  }

  const messaging = getMessaging();
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    throw new Error('Notification permission denied');
  }
}

export async function registerPushToken(
  tokenOverride?: string
): Promise<RegisterPushTokenResponseDto> {
  const messaging = getMessaging();
  await registerDeviceForRemoteMessages(messaging);
  await ensureNotificationPermission();

  const token = tokenOverride ?? (await getToken(messaging));
  const deviceInfo = getDeviceInfo();
  const tokenSuffix = token.slice(-6);
  const payload: RegisterPushTokenRequestDto = {
    token,
    provider: 'fcm',
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
  const messaging = getMessaging();
  const token = tokenOverride ?? (await getToken(messaging));
  const tokenSuffix = token.slice(-6);
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
