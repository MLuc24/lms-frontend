import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken';
import { useNotificationSummary } from '@/features/notifications/hooks/useNotificationSummary';
import { useHomeContinue, useHomeSummary } from '../hooks';

const palette = {
  primary: '#4F46E5',
  secondary: '#818CF8',
  cta: '#F97316',
  background: '#EEF2FF',
  text: '#1E1B4B',
  muted: '#58558A',
  subtle: '#7C7AA8',
  border: '#C7D2FE',
  success: '#22C55E',
  warning: '#F97316',
  surface: '#FFFFFF',
};

function formatMinutes(minutes?: number) {
  if (!minutes) return '0 mins';
  return minutes === 1 ? '1 min' : `${minutes} mins`;
}

export function HomeScreen() {
  const router = useRouter();
  const { profile, user, isAuthenticated } = useAuth();
  useRegisterPushToken(isAuthenticated);
  const { data: summary } = useHomeSummary(isAuthenticated);
  const { data: continueData } = useHomeContinue(isAuthenticated);
  const { data: notificationSummary } = useNotificationSummary(isAuthenticated);

  const continueLearning = summary?.continueLearning ?? continueData?.continueLearning;
  const displayName =
    summary?.user?.displayName || profile?.displayName || user?.displayName || 'Alex';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const dailyGoal = summary?.dailyGoal;
  const currentStreak = summary?.streak;
  const reviewCount = summary?.review?.dueCount ?? 0;
  const notificationCount =
    notificationSummary?.unreadCount ?? summary?.notifications?.unreadCount ?? 0;
  const progressPercent = Math.round((continueLearning?.progressPercent ?? 0));
  const dailyGoalProgress = dailyGoal ? dailyGoal.progressPercent / 100 : 0;

  return (
    <SafeAreaView className="flex-1" style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center">
                <Text className="text-[30px] font-extrabold" style={{ color: palette.text }}>
                  Hi, {displayName}
                </Text>
                <View className="ml-2 h-9 w-9 items-center justify-center rounded-full" style={styles.waveBadge}>
                  <Ionicons name="hand-left" size={18} color={palette.cta} />
                </View>
              </View>
              <Text className="mt-1 text-base" style={{ color: palette.muted }}>
                Ready to learn today?
              </Text>
            </View>

            <View className="relative">
              {summary?.user?.avatarUrl ? (
                <Image
                  source={{ uri: summary.user.avatarUrl }}
                  className="h-14 w-14 rounded-full"
                  accessibilityLabel="User avatar"
                />
              ) : (
                <View className="h-14 w-14 items-center justify-center rounded-full" style={styles.avatarFallback}>
                  <Text className="text-lg font-semibold" style={{ color: palette.text }}>
                    {avatarLetter}
                  </Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white" style={styles.statusDot} />
              {notificationCount > 0 ? (
                <View className="absolute -top-2 -right-2 h-6 min-w-[24px] items-center justify-center rounded-full px-1" style={styles.notificationBadge}>
                  <Text className="text-xs font-semibold text-white">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.mainCard}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xs font-semibold" style={styles.sectionEyebrow}>
                  CONTINUE LEARNING
                </Text>
                <Text className="mt-3 text-2xl font-extrabold" style={{ color: palette.text }}>
                  {continueLearning?.courseTitle || 'Pick a course to start'}
                </Text>
                <Text className="mt-1 text-base" style={{ color: palette.muted }}>
                  {continueLearning
                    ? `Lesson ${continueLearning.lessonOrder}: ${continueLearning.lessonTitle}`
                    : 'Start your first lesson and build momentum.'}
                </Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full" style={styles.lessonBadge}>
                <Ionicons name="cafe" size={22} color={palette.cta} />
              </View>
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-sm font-semibold" style={{ color: palette.text }}>
                {progressPercent}% Complete
              </Text>
              <Text className="text-sm" style={{ color: palette.subtle }}>
                {continueLearning
                  ? `${formatMinutes(continueLearning.remainingMinutes)} left`
                  : 'Start now'}
              </Text>
            </View>
            <View className="mt-3 h-2 w-full rounded-full" style={styles.progressTrack}>
              <View
                className="h-2 rounded-full"
                style={{ width: `${progressPercent}%`, backgroundColor: palette.primary }}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                continueLearning?.lessonId
                  ? router.push(`/lesson/${continueLearning.lessonId}`)
                  : router.push('/(tabs)/learn')
              }
              className="mt-5 flex-row items-center justify-center rounded-full py-4"
              style={styles.primaryButton}
            >
              <Text className="text-base font-semibold text-white">
                {continueLearning ? 'Continue Lesson' : 'Start Learning'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
            </Pressable>
          </View>

          <View className="mt-6 flex-row">
            <View style={styles.statCard}>
              <View className="flex-row items-center justify-between">
                <View className="h-11 w-11 items-center justify-center rounded-full" style={styles.goalBadge}>
                  <Ionicons name="stopwatch" size={20} color={palette.success} />
                </View>
                <Text className="text-sm font-semibold" style={{ color: palette.success }}>
                  {dailyGoal?.progressPercent ?? 0}%
                </Text>
              </View>
              <Text className="mt-4 text-sm" style={{ color: palette.muted }}>
                Daily Goal
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-2xl font-extrabold" style={{ color: palette.text }}>
                  {dailyGoal?.learnedMinutes ?? 0}
                </Text>
                <Text className="ml-1 text-sm" style={{ color: palette.subtle }}>
                  /{dailyGoal?.targetMinutes ?? 0} min
                </Text>
              </View>
              <View className="mt-3 h-2 w-full rounded-full" style={styles.progressTrack}>
                <View
                  className="h-2 rounded-full"
                  style={{ width: `${dailyGoalProgress * 100}%`, backgroundColor: palette.success }}
                />
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/profile/streak-detail')}
              style={[styles.statCard, { marginLeft: 16 }]}
            >
              <View className="h-11 w-11 items-center justify-center rounded-full" style={styles.streakBadge}>
                <Ionicons name="flame" size={20} color={palette.cta} />
              </View>
              <Text className="mt-4 text-sm" style={{ color: palette.muted }}>
                Current Streak
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-2xl font-extrabold" style={{ color: palette.text }}>
                  {currentStreak?.currentDays ?? 0}
                </Text>
                <Text className="ml-1 text-sm" style={{ color: palette.subtle }}>
                  Days
                </Text>
              </View>
              <Text className="mt-2 text-sm font-semibold" style={{ color: palette.warning }}>
                {currentStreak
                  ? `Longest ${currentStreak.longestDays} days`
                  : 'Keep your streak alive'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(tabs)/dashboard')}
            className="mt-6 flex-row items-center justify-between rounded-3xl px-4 py-4"
            style={styles.cardShadow}
          >
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full" style={styles.reviewBadge}>
                <Ionicons name="book" size={20} color={palette.primary} />
              </View>
              <View className="ml-3">
                <Text className="text-base font-semibold" style={{ color: palette.text }}>
                  Review Mistakes
                </Text>
                <Text className="text-sm" style={{ color: palette.subtle }}>
                  {reviewCount} items waiting
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.subtle} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: palette.background,
  },
  waveBadge: {
    backgroundColor: '#FFE4C7',
  },
  avatarFallback: {
    backgroundColor: '#FFECD6',
  },
  statusDot: {
    backgroundColor: palette.success,
  },
  notificationBadge: {
    backgroundColor: '#EF4444',
  },
  sectionEyebrow: {
    color: palette.primary,
    letterSpacing: 2,
  },
  lessonBadge: {
    backgroundColor: '#FFE1C7',
  },
  progressTrack: {
    backgroundColor: '#E6E9FF',
  },
  goalBadge: {
    backgroundColor: '#DCFCE7',
  },
  streakBadge: {
    backgroundColor: '#FFECC7',
  },
  reviewBadge: {
    backgroundColor: '#EDEBFF',
  },
  mainCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 28,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  cardShadow: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
});
