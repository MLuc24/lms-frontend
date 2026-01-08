import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Home Screen
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to LMS!
        </Text>
      </View>
    </SafeAreaView>
  );
}
