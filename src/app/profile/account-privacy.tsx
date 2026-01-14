import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';

export default function AccountPrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader title="Account & Privacy" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-6">
          <Text className="text-sm text-slate-500">
            Manage your personal details, security preferences, and data privacy
            settings.
          </Text>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Account Details
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#dbeafe]">
                  <Ionicons name="mail" size={20} color="#2563eb" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">
                    Email
                  </Text>
                  <Text className="text-sm text-slate-500">
                    sarah.learner@example.com
                  </Text>
                </View>
              </View>
              <Ionicons name="create-outline" size={18} color="#94a3b8" />
            </Pressable>
            <View className="h-px bg-slate-100" />
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#dbeafe]">
                  <Ionicons name="person" size={20} color="#2563eb" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">
                    Username
                  </Text>
                  <Text className="text-sm text-slate-500">
                    PolyglotSarah99
                  </Text>
                </View>
              </View>
              <Ionicons name="create-outline" size={18} color="#94a3b8" />
            </Pressable>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Security
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#e0f2fe]">
                  <Ionicons name="lock-closed" size={20} color="#0284c7" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Change Password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </Pressable>
            <View className="h-px bg-slate-100" />
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#e0f2fe]">
                  <Ionicons name="shield-checkmark" size={20} color="#0284c7" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Two-Factor Auth
                </Text>
              </View>
              <Text className="text-sm text-slate-500">Off</Text>
            </Pressable>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Legal
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9]">
                  <Ionicons name="document-text" size={20} color="#64748b" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Privacy Policy
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color="#94a3b8" />
            </Pressable>
            <View className="h-px bg-slate-100" />
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9]">
                  <Ionicons name="hammer" size={20} color="#64748b" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Terms of Service
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color="#94a3b8" />
            </Pressable>
            <View className="h-px bg-slate-100" />
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9]">
                  <Ionicons name="download" size={20} color="#64748b" />
                </View>
                <Text className="ml-4 text-base font-semibold text-slate-900">
                  Data Export Request
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </Pressable>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-widest text-red-400">
            Danger Zone
          </Text>
          <View className="mt-4 rounded-3xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#fee2e2]">
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-red-500">
                    Delete Account
                  </Text>
                  <Text className="text-sm text-slate-500">
                    This action is permanent and cannot be undone.
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#fca5a5" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
