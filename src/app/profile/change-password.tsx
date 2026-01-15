import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/features/profile/components/ScreenHeader';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';

export default function ChangePasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScreenHeader title="Change Password" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-6">
          <View className="rounded-3xl bg-white p-6 shadow-sm">
            <Text className="text-lg font-semibold text-slate-900">
              Update your password
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              Use a strong password you do not reuse elsewhere.
            </Text>

            <View className="mt-6">
              <ChangePasswordForm
                onSuccess={() => {
                  Alert.alert('Password updated', 'Your password has been changed.');
                  router.back();
                }}
                onCancel={() => router.back()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
