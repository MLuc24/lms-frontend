import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, isLoggingOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader title="Settings" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-6">
          <Text className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            General
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#e0f2fe]">
                  <Ionicons name="school" size={20} color="#2d7cff" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Learning Language
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-slate-500">
                  Spanish (ES)
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </View>
            </Pressable>
            <View className="h-px bg-slate-100" />
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#ede9fe]">
                  <Ionicons name="globe" size={20} color="#8b5cf6" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  App Language
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-slate-500">English</Text>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </View>
            </Pressable>
            <View className="h-px bg-slate-100" />
            <View className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9]">
                  <Ionicons name="moon" size={20} color="#64748b" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Dark Mode
                </Text>
              </View>
              <Switch value={false} />
            </View>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Support & Info
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#dcfce7]">
                  <Ionicons name="help-circle" size={20} color="#10b981" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Help Center
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </Pressable>
            <View className="h-px bg-slate-100" />
            <View className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#ffedd5]">
                  <Ionicons name="information-circle" size={20} color="#f97316" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  About
                </Text>
              </View>
              <Text className="text-sm text-slate-500">v2.4.0</Text>
            </View>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Security
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable
              onPress={() => router.push('/profile/change-password')}
              className="flex-row items-center justify-between px-5 py-4"
            >
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#e2e8f0]">
                  <Ionicons name="key" size={20} color="#475569" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Change Password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </Pressable>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Data
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9]">
                  <Ionicons name="trash" size={20} color="#64748b" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Clear Cache
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </Pressable>
            <View className="h-px bg-slate-100" />
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#fee2e2]">
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </View>
                <Text className="ml-4 text-base font-semibold text-red-500">
                  Reset Progress
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#fca5a5" />
            </Pressable>
          </View>

          <Text className="mt-3 text-xs text-slate-400">
            Resetting progress cannot be undone and will remove your current
            streak.
          </Text>

          <Pressable 
            onPress={() => logout()}
            disabled={isLoggingOut}
            className="mt-8 items-center rounded-full border border-[#e2e8f0] bg-white py-4"
          >
            <Text className="text-base font-semibold text-slate-900">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </Pressable>

          <Text className="mt-6 text-center text-xs text-slate-300">
            LingoApp Inc. (c) 2024
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
