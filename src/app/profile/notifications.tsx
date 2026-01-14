import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';
import { notificationsMock } from '@/features/profile/mock';

const toneColor = {
  orange: '#f97316',
  gold: '#f59e0b',
  blue: '#3b82f6',
  gray: '#94a3b8',
};

export default function NotificationsScreen() {
  const router = useRouter();
  const sections = ['Today', 'Yesterday', 'Earlier'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="border-b border-slate-100">
        <ScreenHeader
          title="Notifications"
          onBack={() => router.back()}
          rightIcon="checkmark-done"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-4">
          <View className="flex-row">
            {['All', 'Unread', 'Mentions'].map((tab, index) => (
              <Pressable
                key={tab}
                className={`rounded-full px-5 py-2 ${
                  index === 0 ? 'bg-[#2d7cff]' : 'bg-[#f1f5f9]'
                } ${index === 0 ? '' : 'ml-3'}`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    index === 0 ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {sections.map((section) => (
          <View key={section} className="px-6 pt-6">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {section}
            </Text>
            <View className="mt-4">
              {notificationsMock
                .filter((item) => item.section === section)
                .map((item, index) => (
                  <View
                    key={item.id}
                    className={`flex-row items-start ${
                      index === 0 ? '' : 'mt-5'
                    }`}
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-[#f8fafc]">
                      <Ionicons
                        name={item.icon as keyof typeof Ionicons.glyphMap}
                        size={22}
                        color={toneColor[item.tone]}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-base font-semibold text-slate-900">
                        {item.title}
                      </Text>
                      <Text className="mt-1 text-sm text-slate-500">
                        {item.body}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-slate-400">{item.time}</Text>
                      {item.unread ? (
                        <View className="mt-2 h-2.5 w-2.5 rounded-full bg-[#2d7cff]" />
                      ) : null}
                    </View>
                  </View>
                ))}
            </View>
          </View>
        ))}

        <View className="mt-8 items-center">
          <View className="h-2 w-2 rounded-full bg-slate-200" />
          <Text className="mt-4 text-sm text-slate-300">
            No more notifications
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
