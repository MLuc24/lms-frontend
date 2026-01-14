import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';
import { progressMock } from '@/features/profile/mock';

export default function ProgressScreen() {
  const router = useRouter();
  const maxValue = Math.max(...progressMock.week.map((item) => item.value));

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader
        title="Your Progress"
        onBack={() => router.back()}
        rightIcon="settings"
        onRightPress={() => router.push('/profile/settings')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-4">
          <Text className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Overview
          </Text>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-3xl font-semibold text-slate-900">
              You studied{' '}
              <Text className="text-[#2d7cff]">
                {progressMock.daysStudied} days
              </Text>{' '}
              this week!
            </Text>
            <Pressable className="rounded-full bg-white px-4 py-2 shadow-sm">
              <Text className="text-sm font-medium text-slate-700">
                This Week
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-8 px-6">
          <View className="rounded-3xl bg-white px-5 py-6 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="stats-chart" size={20} color="#2d7cff" />
                <Text className="ml-3 text-base font-semibold text-slate-900">
                  Activity
                </Text>
              </View>
              <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Minutes
              </Text>
            </View>
            <View className="mt-6 flex-row items-end justify-between">
              {progressMock.week.map((item, index) => {
                const height = (item.value / maxValue) * 120 + 16;
                const isActive = item.value === maxValue;
                return (
                  <View key={`${item.day}-${index}`} className="items-center">
                    <View
                      style={{ height }}
                      className={`w-9 rounded-full ${
                        isActive ? 'bg-[#2d7cff]' : 'bg-[#e5e7eb]'
                      }`}
                    />
                    <Text className="mt-3 text-xs font-semibold text-slate-500">
                      {item.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mt-6 flex-row px-6">
          <View className="mr-4 flex-1 rounded-3xl bg-white px-5 py-5 shadow-sm">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fff7ed]">
              <Ionicons name="time" size={20} color="#f97316" />
            </View>
            <Text className="mt-4 text-sm font-medium text-slate-500">
              Total Time
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-slate-900">
              {progressMock.totalTime}
            </Text>
          </View>
          <View className="flex-1 rounded-3xl bg-white px-5 py-5 shadow-sm">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#ede9fe]">
              <Ionicons name="school" size={20} color="#8b5cf6" />
            </View>
            <Text className="mt-4 text-sm font-medium text-slate-500">
              Lessons
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-slate-900">
              {progressMock.lessons}
            </Text>
          </View>
        </View>

        <View className="mt-6 px-6">
          <View className="overflow-hidden rounded-3xl bg-[#2d7cff] shadow-sm">
            <View className="px-6 pt-6">
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
                <Text className="ml-4 text-base font-semibold text-white">
                  Accuracy Rate
                </Text>
              </View>
              <Text className="mt-4 text-4xl font-semibold text-white">
                {progressMock.accuracy}%
              </Text>
            </View>
            <View className="mt-8 items-center px-6 pb-6">
              <Pressable className="w-full flex-row items-center justify-center rounded-full bg-[#111827] py-4">
                <Text className="text-base font-semibold text-white">
                  Keep it up!
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
