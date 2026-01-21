import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-semibold text-[#0F172A]">Explore</Text>
        <Text className="mt-2 text-sm text-[#64748B]">New lessons coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}
