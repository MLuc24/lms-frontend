import { View, Text, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as Device from 'expo-device';
import { Button } from '@/shared/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  registerPushToken,
  sendTestPush,
} from '@/features/notifications/services/notification.service';

// Dynamically import notifications to avoid Expo Go warnings
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  // Configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.log('[Push] Notifications not available in this environment');
}

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<
    'idle' | 'registering' | 'registered' | 'error' | 'unavailable'
  >('idle');
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
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
    if (!isAuthenticated || !Notifications) {
      if (!Notifications) {
        setTokenStatus('unavailable');
        setTokenMessage('Push notifications unavailable in Expo Go');
      }
      return;
    }

    let isActive = true;
    let subscription: any = null;

    const register = async (tokenOverride?: string) => {
      try {
        setTokenStatus('registering');
        setTokenMessage(null);

        // Get push token
        let token = tokenOverride;
        if (!token) {
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
            throw new Error('Permission not granted for push notifications');
          }

          const pushToken = await Notifications.getExpoPushTokenAsync();
          token = pushToken.data;
        }

        const response = await registerPushToken(token);
        console.log('[Push] Registered in app state', response);
        
        if (!isActive) {
          return;
        }
        
        hasRegisteredRef.current = true;
        setTokenStatus('registered');
        setTokenMessage('Push token registered');
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
