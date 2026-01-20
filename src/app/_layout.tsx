import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Disabled in Expo Go - enable in development build
// import { ForegroundNotificationListener } from '@/features/notifications/components/ForegroundNotificationListener';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Disabled in Expo Go - enable in development build */}
      {/* <ForegroundNotificationListener /> */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </QueryClientProvider>
  );
}
