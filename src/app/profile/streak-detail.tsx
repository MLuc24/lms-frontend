import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';
import { streakMock } from '@/features/profile/mock';

export default function StreakDetailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader title="Streak Detail" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-6">
          <View className="items-center rounded-3xl bg-white px-6 py-8 shadow-sm">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#ffedd5]">
              <Ionicons name="flame" size={28} color="#f97316" />
            </View>
            <Text className="mt-4 text-5xl font-semibold text-slate-900">
              {streakMock.days}
            </Text>
            <Text className="mt-2 text-base font-medium text-slate-500">
              Days in a row
            </Text>
          </View>
        </View>

        <View className="mt-6 px-6">
          <View className="rounded-3xl bg-white px-5 py-6 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                This Week
              </Text>
              <Text className="text-sm font-semibold text-[#2d7cff]">
                Perfect Week!
              </Text>
            </View>
            <View className="mt-5 flex-row items-center justify-between">
              {streakMock.week.map((item, index) => {
                const active = item.done;
                const highlight = item.highlight;
                return (
                  <View key={`${item.day}-${index}`} className="items-center">
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${
                        highlight
                          ? 'bg-[#2d7cff]'
                          : active
                            ? 'bg-[#dbeafe]'
                            : 'bg-[#f1f5f9]'
                      }`}
                    >
                      {active ? (
                        <Ionicons
                          name={highlight ? 'flame' : 'checkmark'}
                          size={18}
                          color={highlight ? '#fff' : '#2d7cff'}
                        />
                      ) : null}
                    </View>
                    <Text className="mt-2 text-xs font-semibold text-slate-500">
                      {item.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mt-6 px-6">
          <View className="rounded-3xl bg-[#eff6ff] px-5 py-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Ionicons name="snow" size={20} color="#3b82f6" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">
                    Streak Freeze
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    {streakMock.freezeCount} freezes equipped
                  </Text>
                </View>
              </View>
              <Switch value={streakMock.freezeEnabled} />
            </View>
          </View>
        </View>

        <View className="mt-6 px-6">
          <View className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <View className="h-40 bg-[#fde68a]">
              <View className="h-full w-full items-center justify-center">
                <Ionicons name="happy" size={48} color="#0f172a" />
              </View>
            </View>
            <View className="px-5 py-5">
              <Text className="text-xl font-semibold text-slate-900">
                "Consistency is the key to mastery. Keep it up!"
              </Text>
              <Text className="mt-3 text-sm text-slate-500">
                Completing a lesson extends your streak to{' '}
                <Text className="font-semibold text-orange-500">13 days</Text>!
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6 px-6">
          <Pressable className="flex-row items-center justify-center rounded-full bg-[#2d7cff] py-4 shadow-sm">
            <Ionicons name="play" size={18} color="#fff" />
            <Text className="ml-2 text-base font-semibold text-white">
              Start Today's Lesson
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
