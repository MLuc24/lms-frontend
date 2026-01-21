import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Button } from '@/shared/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  registerPushToken,
  sendTestPush,
  loadNotifications,
} from '@/features/notifications/services/notification.service';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [tokenStatus, setTokenStatus] = useState<
    'idle' | 'registering' | 'registered' | 'error' | 'unavailable'
  >(isExpoGo ? 'unavailable' : 'idle');
  const [tokenMessage, setTokenMessage] = useState<string | null>(
    isExpoGo ? 'Push notifications require a development build' : null
  );
  const hasRegisteredRef = useRef(false);

  const sendTestMutation = useMutation({
    mutationFn: sendTestPush,
    onSuccess: (data) => {
      Alert.alert('Push sent', data.message);
    },
    onError: (error: any) => {
      Alert.alert('Push failed', error?.message || 'Unable to send push');
    },
  });

  useEffect(() => {
    // Skip if Expo Go or not authenticated
    if (isExpoGo || !isAuthenticated) {
      return;
    }

    // Try to load notifications module
    const Notifications = loadNotifications();
    if (!Notifications) {
      setTokenStatus('unavailable');
      setTokenMessage('Push notifications not available');
      return;
    }

    let isActive = true;
    let subscription: any = null;

    const register = async (tokenOverride?: string) => {
      try {
        setTokenStatus('registering');
        setTokenMessage('Registering push token...');

        const response = await registerPushToken(tokenOverride);
        
        if (!isActive) {
          return;
        }
        
        hasRegisteredRef.current = true;
        setTokenStatus('registered');
        setTokenMessage('Push notifications enabled');
      } catch (error: any) {
        console.error('[Push] Registration failed', error);
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

    // Listen for token updates
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
        
        <View className="mt-8 w-full px-6 gap-3">
          {/* Push Notification Test */}
          <Button
            variant="primary"
            isLoading={sendTestMutation.isPending}
            disabled={!isAuthenticated || tokenStatus !== 'registered'}
            onPress={() => sendTestMutation.mutate()}
          >
            Send test notification
          </Button>
          
          <Text className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
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
