import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient Background */}
        <View className="relative pb-6">
          <LinearGradient
            colors={['#6366f1', '#8b5cf6', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 h-72"
            style={{
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          />

          {/* QR Code - Top Right Corner */}
          <View className="absolute top-4 right-4">
            <View
              className="bg-white rounded-xl p-2"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <Image
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=LMS-User-Profile' }}
                className="w-[60px] h-[60px] rounded-lg"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Avatar Section */}
          <View className="items-center px-6 pt-6">
            <View className="relative">
              {/* Avatar with enhanced shadow */}
              <View
                className="h-28 w-28 items-center justify-center rounded-full bg-white"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 10,
                }}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    className="h-[100px] w-[100px] rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../../assets/icon.png')}
                    className="h-[100px] w-[100px] rounded-full"
                    resizeMode="cover"
                  />
                )}
              </View>

              {/* Edit Button with gradient - Made smaller */}
              <Pressable
                onPress={handlePickImage}
                disabled={isUploading}
                className="absolute bottom-0 right-0"
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    shadowColor: '#6366f1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="create-outline" size={16} color="#fff" />
                  )}
                </LinearGradient>
              </Pressable>
            </View>

            {/* User Info - Fixed text colors */}
            {isLoadingProfile && !profileData ? (
              <ActivityIndicator className="mt-2" size="small" color="#fff" />
            ) : (
              <>
                <Text className="mt-2 text-xl font-black text-gray-800" style={{ fontFamily: 'System' }}>
                  {displayName}
                </Text>
                <View className="mt-1 bg-white/90 rounded-full px-3 py-1">
                  <Text className="text-xs font-semibold text-gray-600">
                    Learning Spanish 🇪🇸
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View className="mt-4 px-5">
          <View className="flex-row justify-between gap-3">
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

        {/* Menu Section */}
        <View className="mt-8 px-5 space-y-3">
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

        {/* Footer Section */}
        <View className="mt-10 items-center px-6">
          <View className="items-center">
            <View className="h-px w-32 bg-gray-300 mb-4" />
            <Text className="text-sm font-medium text-slate-400">
              Member since {memberSince}
            </Text>
          </View>

          <Pressable
            onPress={() => logout()}
            disabled={isLoggingOut}
            className="mt-6 rounded-full px-8 py-3.5 bg-red-50 active:bg-red-100"
            style={{
              shadowColor: '#ef4444',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-base font-bold text-red-500">
              {isLoggingOut ? 'Logging Out...' : 'Log Out'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
