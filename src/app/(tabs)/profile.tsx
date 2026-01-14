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
        <View className="relative px-6 pt-6">
          <Text className="text-center text-2xl font-extrabold text-[#1a1a1a]" style={{ fontFamily: 'System' }}>
            Profile Overview
          </Text>

          <View className="mt-6 items-center">
            <View className="relative">
              <View className="h-32 w-32 items-center justify-center rounded-full bg-[#e8e8e8] shadow-md">
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
                className="absolute bottom-1 right-1 h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6] shadow-lg"
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="create-outline" size={18} color="#fff" />
                )}
              </Pressable>
            </View>
            {isLoadingProfile && !profileData ? (
              <ActivityIndicator className="mt-4" size="small" color="#3b82f6" />
            ) : (
              <>
                <Text className="mt-4 text-2xl font-extrabold text-[#1a1a1a]" style={{ fontFamily: 'System' }}>
                  {displayName}
                </Text>
                <Text className="mt-1 text-base font-normal text-[#8b8b8b]">
                  Learning Spanish 🇪🇸
                </Text>
              </>
            )}
          </View>
        </View>

        <View className="mt-6 px-6">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard
                icon="book"
                value={stats[0].value}
                label={stats[0].label}
              />
            </View>
            <View className="flex-1">
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

        <View className="mt-6 px-6 gap-3">
          <ActionRow
            icon="stats-chart"
            title="Learning Statistics"
            onPress={() => router.push('/profile/progress')}
          />
          <ActionRow
            icon="notifications"
            title="Notification Settings"
            onPress={() => router.push('/profile/notifications')}
          />
          <ActionRow
            icon="settings"
            title="App Settings"
            onPress={() => router.push('/profile/settings')}
          />
          <ActionRow
            icon="help-circle"
            title="Help & Support"
            onPress={() => router.push('/profile/settings')}
          />
        </View>

        <View className="mt-8 items-center px-6">
          <Text className="text-sm font-normal text-[#c0c0c0]">
            Member since {memberSince}
          </Text>
          <Pressable
            onPress={() => logout()}
            disabled={isLoggingOut}
            className="mt-4"
          >
            <Text className="text-base font-semibold text-[#ff5252]">
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
