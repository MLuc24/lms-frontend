import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';

export default function EmptyProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader title="Profile" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="items-center px-6 pt-8">
          <View className="h-52 w-52 items-center justify-center rounded-[48px] bg-[#e0f2fe] shadow-sm">
            <Ionicons name="book" size={64} color="#2d7cff" />
          </View>
          <Text className="mt-8 text-2xl font-semibold text-slate-900">
            Your learning journey starts here
          </Text>
          <Text className="mt-3 text-center text-sm text-slate-500">
            Complete your first lesson to unlock your profile stats, streaks,
            and badges.
          </Text>
          <Pressable className="mt-8 w-full rounded-full bg-[#2d7cff] py-4">
            <Text className="text-center text-base font-semibold text-white">
              Start your first lesson
            </Text>
          </Pressable>
          <Pressable className="mt-4">
            <Text className="text-sm font-semibold text-[#2d7cff]">
              Personalize Goal
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
