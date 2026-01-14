import { useEffect } from 'react';
import { Platform } from 'react-native';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export function ForegroundNotificationListener() {
  useEffect(() => {
    const initChannel = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
      });
    };

    void initChannel();

    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, async (message) => {
      const title = message.notification?.title || 'Notification';
      const body = message.notification?.body || '';

      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: 'default',
          pressAction: { id: 'default' },
        },
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
}
