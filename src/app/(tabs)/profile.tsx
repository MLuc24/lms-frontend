import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatCard } from '@/features/profile/components/StatCard';
import { ActionRow } from '@/features/profile/components/ActionRow';
import { profileMock } from '@/features/profile/mock';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAvatarUploader } from '@/features/profile/hooks/useAvatarUploader';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, isLoggingOut, profile, user, isLoadingProfile } = useAuth();
  const { avatarUrl, isUploading, handlePickImage } = useAvatarUploader();
  const { stats } = profileMock;
  const profileData = profile ?? user;
  const displayName = profileData?.displayName ?? profileMock.name;
  const memberSince = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : profileMock.memberSince;
  const statusLabel = profileData?.status
    ? profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1)
    : 'Active';

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative px-6 pt-8">
          <View className="absolute -top-6 right-0 h-40 w-40 rounded-full bg-[#eef4ff]" />
          <View className="absolute -top-10 left-0 h-28 w-28 rounded-full bg-[#f3f7ff]" />
          <Text className="text-center text-3xl font-bold text-slate-900">
            Profile Overview
          </Text>

          <View className="mt-8 items-center">
            <View className="relative">
              <View className="h-36 w-36 items-center justify-center rounded-full bg-white shadow-lg border-4 border-white">
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    className="h-full w-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../../assets/icon.png')}
                    className="h-full w-full rounded-full"
                    resizeMode="cover"
                  />
                )}
              </View>
              <Pressable 
                onPress={handlePickImage}
                disabled={isUploading}
                className="absolute bottom-0 right-0 h-12 w-12 items-center justify-center rounded-full bg-[#2d7cff] shadow-md"
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="create" size={20} color="#fff" />
                )}
              </Pressable>
            </View>
            {isLoadingProfile && !profileData ? (
              <ActivityIndicator className="mt-6" size="small" color="#0ea5e9" />
            ) : (
              <>
                <Text className="mt-5 text-3xl font-bold text-slate-900">
                  {displayName}
                </Text>
                <Text className="mt-2 text-base font-medium text-slate-500">
                  {statusLabel} 🇪🇸
                </Text>
              </>
            )}
          </View>
        </View>

        <View className="mt-8 px-6">
          <View className="flex-row">
            <View className="mr-4 flex-1">
              <StatCard
                icon="book"
                value={stats[0].value}
                label={stats[0].label}
              />
            </View>
            <View className="mr-4 flex-1">
              <StatCard
                icon="flame"
                value={stats[1].value}
                label={stats[1].label}
                highlight
              />
            </View>
            <View className="flex-1">
              <StatCard
                icon="trophy"
                value={stats[2].value}
                label={stats[2].label}
              />
            </View>
          </View>
        </View>

        <View className="mt-8 px-6">
          <ActionRow
            icon="stats-chart"
            title="Learning Statistics"
            onPress={() => router.push('/profile/progress')}
          />
          <View className="mt-3">
            <ActionRow
              icon="notifications"
              title="Notification Settings"
              onPress={() => router.push('/profile/notifications')}
            />
          </View>
          <View className="mt-3">
            <ActionRow
              icon="settings"
              title="App Settings"
              onPress={() => router.push('/profile/settings')}
            />
          </View>
          <View className="mt-3">
            <ActionRow
              icon="help-circle"
              title="Help & Support"
              onPress={() => router.push('/profile/settings')}
            />
          </View>
        </View>

        <View className="mt-10 items-center px-6">
          <Text className="text-sm font-medium text-slate-400">
            Member since {memberSince}
          </Text>
          <Pressable
            onPress={() => logout()}
            disabled={isLoggingOut}
            className="mt-6"
          >
            <Text className="text-base font-bold text-rose-500">
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
