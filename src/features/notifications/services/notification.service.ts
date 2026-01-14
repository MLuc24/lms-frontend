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
  console.log('[Push] Registering token', {
    suffix: tokenSuffix,
    platform: deviceInfo.platform,
  });

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
  console.log('[Push] Token registered', response);
  return response;
}

export async function deactivatePushToken(
  tokenOverride?: string
): Promise<DeactivatePushTokenResponseDto> {
  const messaging = getMessaging();
  const token = tokenOverride ?? (await getToken(messaging));
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
