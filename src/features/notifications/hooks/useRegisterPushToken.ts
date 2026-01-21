import { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { loadNotifications, registerPushToken } from '../services/notification.service';

type TokenStatus = 'idle' | 'registering' | 'registered' | 'error' | 'unavailable';

export function useRegisterPushToken(isEnabled: boolean) {
  const isExpoGo = Constants.appOwnership === 'expo';
  const [status, setStatus] = useState<TokenStatus>(isExpoGo ? 'unavailable' : 'idle');
  const [message, setMessage] = useState<string | null>(
    isExpoGo ? 'Push notifications require a development build' : null
  );
  const hasRegisteredRef = useRef(false);

  useEffect(() => {
    if (isExpoGo || !isEnabled) {
      return;
    }

    const Notifications = loadNotifications();
    if (!Notifications) {
      setStatus('unavailable');
      setMessage('Push notifications not available');
      return;
    }

    let isActive = true;
    let subscription: { remove: () => void } | null = null;

    const register = async (tokenOverride?: string) => {
      try {
        setStatus('registering');
        setMessage('Registering push token...');

        await registerPushToken(tokenOverride);

        if (!isActive) {
          return;
        }

        hasRegisteredRef.current = true;
        setStatus('registered');
        setMessage('Push notifications enabled');
      } catch (error: any) {
        console.error('[Push] Registration failed', error);
        if (!isActive) {
          return;
        }
        setStatus('error');
        setMessage(error?.message || 'Failed to register push token');
      }
    };

    if (!hasRegisteredRef.current) {
      void register();
    }

    try {
      subscription = Notifications.addPushTokenListener((tokenData: any) => {
        void register(tokenData.data);
      });
    } catch (error) {
      console.log('[Push] Token listener not available');
    }

    return () => {
      isActive = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isEnabled, isExpoGo]);

  return { status, message, isSupported: !isExpoGo };
}
