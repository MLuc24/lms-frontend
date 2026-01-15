import { useEffect } from 'react';

// Dynamically import to avoid Expo Go warnings
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.log('[Notifications] Not available in this environment');
}

export function ForegroundNotificationListener() {
  useEffect(() => {
    if (!Notifications) {
      return;
    }

    try {
      // Configure how notifications are handled when app is in foreground
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // Listen for notifications received while app is foregrounded
      const subscription = Notifications.addNotificationReceivedListener((notification: any) => {
        console.log('[Notification] Received in foreground:', notification);
      });

      return () => subscription.remove();
    } catch (error) {
      console.log('[Notifications] Listener setup failed:', error);
    }
  }, []);

  return null;
}
