import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';

export default function ReminderSettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader title="Reminder Settings" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-6">
          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#e0f2fe]">
                  <Ionicons name="notifications" size={22} color="#2d7cff" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">
                    Allow Notifications
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    Stay on track with your daily goals
                  </Text>
                </View>
              </View>
              <Switch value />
            </View>
          </View>

          <View className="mt-6 rounded-3xl bg-white px-5 py-6 shadow-sm">
            <Text className="text-base font-semibold text-slate-900">
              Daily Reminder Time
            </Text>
            <View className="mt-6 flex-row items-center justify-center">
              <View className="items-center">
                <Ionicons name="chevron-up" size={18} color="#94a3b8" />
                <View className="mt-2 h-16 w-16 items-center justify-center rounded-2xl bg-[#f8fafc]">
                  <Text className="text-2xl font-semibold text-slate-900">
                    08
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#94a3b8" />
              </View>
              <Text className="mx-4 text-3xl font-semibold text-slate-900">
                :
              </Text>
              <View className="items-center">
                <Ionicons name="chevron-up" size={18} color="#94a3b8" />
                <View className="mt-2 h-16 w-16 items-center justify-center rounded-2xl bg-[#f8fafc]">
                  <Text className="text-2xl font-semibold text-slate-900">
                    30
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#94a3b8" />
              </View>
              <View className="ml-4">
                <Pressable className="rounded-full bg-[#2d7cff] px-4 py-2">
                  <Text className="text-sm font-semibold text-white">AM</Text>
                </Pressable>
                <Pressable className="mt-3 rounded-full bg-[#f1f5f9] px-4 py-2">
                  <Text className="text-sm font-semibold text-slate-500">
                    PM
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="mt-6 rounded-3xl bg-white px-5 py-6 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-slate-900">
                Frequency
              </Text>
              <View className="rounded-full bg-[#e0f2fe] px-3 py-1">
                <Text className="text-xs font-semibold text-[#2d7cff]">
                  Recurring
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-center justify-between rounded-full bg-[#f1f5f9] p-1">
              {['Daily', 'Weekdays', 'Weekends'].map((label, index) => (
                <Pressable
                  key={label}
                  className={`flex-1 items-center rounded-full py-2 ${
                    index === 0 ? 'bg-white' : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      index === 0 ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mt-6 rounded-3xl bg-white px-5 py-6 shadow-sm">
            <Text className="text-base font-semibold text-slate-900">
              Preferences
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Customize when we should not disturb you.
            </Text>
            <View className="mt-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9]">
                    <Ionicons name="moon" size={18} color="#64748b" />
                  </View>
                  <Text className="ml-3 text-sm font-semibold text-slate-900">
                    Quiet Hours
                  </Text>
                </View>
                <Switch value={false} />
              </View>
              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9]">
                    <Ionicons name="bulb" size={18} color="#64748b" />
                  </View>
                  <Text className="ml-3 text-sm font-semibold text-slate-900">
                    Smart Nudges
                  </Text>
                </View>
                <Switch value />
              </View>
            </View>
          </View>

          <View className="mt-6 items-center">
            <View className="flex-row items-center">
              <Ionicons name="rocket" size={18} color="#2d7cff" />
              <Text className="ml-2 text-sm text-[#2d7cff]">
                You are 3x more likely to reach your goals with daily reminders.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
