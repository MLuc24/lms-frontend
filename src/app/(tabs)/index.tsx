import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getMessaging, onTokenRefresh } from '@react-native-firebase/messaging';
import { Button } from '@/shared/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  registerPushToken,
  sendTestPush,
} from '@/features/notifications/services/notification.service';

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<
    'idle' | 'registering' | 'registered' | 'error'
  >('idle');
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const hasRegisteredRef = useRef(false);

  const sendTestMutation = useMutation({
    mutationFn: sendTestPush,
    onSuccess: (data) => {
      console.log('[Push] Test notification sent', data);
      Alert.alert('Push sent', data.message);
    },
    onError: (error: any) => {
      console.log('[Push] Test notification failed', error);
      Alert.alert('Push failed', error?.message || 'Unable to send push');
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isActive = true;

    const register = async (tokenOverride?: string) => {
      try {
        setTokenStatus('registering');
        setTokenMessage(null);
        const response = await registerPushToken(tokenOverride);
        console.log('[Push] Registered in app state', response);
        if (!isActive) {
          return;
        }
        hasRegisteredRef.current = true;
        setTokenStatus('registered');
        setTokenMessage('Push token registered');
      } catch (error: any) {
        if (!isActive) {
          return;
        }
        setTokenStatus('error');
        setTokenMessage(error?.message || 'Failed to register push token');
      }
    };

    if (!hasRegisteredRef.current) {
      void register();
    }

    const messaging = getMessaging();
    const unsubscribe = onTokenRefresh(messaging, async (token) => {
      await register(token);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [isAuthenticated]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Home Screen
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to LMS!
        </Text>
        <View className="mt-6 w-full px-6">
          <Button
            variant="primary"
            isLoading={sendTestMutation.isPending}
            disabled={!isAuthenticated || tokenStatus !== 'registered'}
            onPress={() => sendTestMutation.mutate()}
          >
            Send test notification
          </Button>
          <Text className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            {tokenMessage ||
              (isAuthenticated
                ? 'Registering push token...'
                : 'Login to enable push notifications')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
