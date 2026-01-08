import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/shared/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile
        </Text>

        {user && (
          <View className="mb-8">
            <Text className="text-base text-gray-600 dark:text-gray-400 mb-2">
              Display Name:
            </Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {user.displayName}
            </Text>

            {user.email && (
              <>
                <Text className="text-base text-gray-600 dark:text-gray-400 mb-2">
                  Email:
                </Text>
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {user.email}
                </Text>
              </>
            )}

            {user.phone && (
              <>
                <Text className="text-base text-gray-600 dark:text-gray-400 mb-2">
                  Phone:
                </Text>
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {user.phone}
                </Text>
              </>
            )}
          </View>
        )}

        <Button
          onPress={() => logout()}
          isLoading={isLoggingOut}
          variant="outline"
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
}
