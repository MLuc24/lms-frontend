import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProgressRing } from '@/shared/components/ProgressRing';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNotificationSummary } from '@/features/notifications/hooks/useNotificationSummary';
import { getTimeZone } from '@/shared/utils/timezone';
import { getLocalISODate } from '@/shared/utils/date';
import {
  useProgressToday,
  useReviewQueue,
  useReviewSummary,
  useStreak,
} from '../hooks';

const palette = {
  primary: '#4F46E5',
  secondary: '#818CF8',
  cta: '#F97316',
  background: '#EEF2FF',
  text: '#1E1B4B',
  muted: '#58558A',
  subtle: '#7C7AA8',
  border: '#C7D2FE',
  warning: '#F97316',
  success: '#22C55E',
  surface: '#FFFFFF',
};

export function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ringSize = Math.min(width * 0.72, 260);
  const ringStroke = Math.max(10, Math.round(ringSize * 0.08));
  const { isAuthenticated } = useAuth();
  const timeZone = getTimeZone();
  const todayIso = getLocalISODate(new Date());
  const { data: today } = useProgressToday({ date: todayIso, timeZone }, isAuthenticated);
  const { data: streak } = useStreak(timeZone, isAuthenticated);
  const { data: reviewSummary } = useReviewSummary(timeZone, isAuthenticated);
  const { data: reviewQueue } = useReviewQueue({ page: 1, limit: 4 }, isAuthenticated);
  const { data: notificationSummary } = useNotificationSummary(isAuthenticated);

  const ringProgress = today?.goal?.progressPercent ?? 0;
  const learnedMinutes = today?.minutesLearned ?? 0;
  const streakDays = today?.streakDays ?? streak?.currentDays ?? 0;
  const xpEarned = today?.xpEarned ?? 0;
  const lessonsCompleted = today?.lessonsCompleted ?? 0;
  const notificationCount = notificationSummary?.unreadCount ?? 0;

  return (
    <SafeAreaView className="flex-1" style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-2">
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full"
              style={styles.iconShadow}
            >
              <Ionicons name="arrow-back" size={20} color={palette.text} />
            </Pressable>

            <Text className="text-base font-semibold" style={{ color: palette.text }}>
              Today's Progress
            </Text>

            <View className="flex-row items-center rounded-full px-3 py-1" style={styles.streakPill}>
              <Ionicons name="flame" size={16} color={palette.cta} />
              <Text className="ml-1 text-sm font-semibold" style={{ color: palette.cta }}>
                {streakDays} Days
              </Text>
              {notificationCount > 0 ? (
                <View className="ml-2 h-5 min-w-[20px] items-center justify-center rounded-full px-1" style={styles.notificationBadge}>
                  <Text className="text-xs font-semibold text-white">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View className="mt-10 items-center px-6">
          <View style={styles.ringShadow}>
            <ProgressRing
              size={ringSize}
              strokeWidth={ringStroke}
              progress={ringProgress}
              color={palette.primary}
              trackColor={palette.border}
            >
              <View className="items-center">
                <Text className="text-4xl font-extrabold" style={{ color: palette.text }}>
                  {learnedMinutes}
                </Text>
                <Text className="mt-1 text-sm" style={{ color: palette.subtle }}>
                  Minutes Learned
                </Text>
              </View>
            </ProgressRing>
          </View>

          <Text className="mt-6 text-center text-sm" style={{ color: palette.muted }}>
            {ringProgress >= 100
              ? "Daily goal achieved. Keep the momentum rolling!"
              : 'You are close. A few more minutes will reach your daily goal.'}
          </Text>
        </View>

        <View className="mt-8 flex-row px-6">
          <View style={styles.statCard}>
            <View className="h-11 w-11 items-center justify-center rounded-full" style={styles.xpBadge}>
              <Ionicons name="flash" size={20} color={palette.cta} />
            </View>
            <Text className="mt-4 text-xl font-extrabold" style={{ color: palette.text }}>
              {xpEarned} XP
            </Text>
            <Text className="text-sm" style={{ color: palette.subtle }}>
              Earned Today
            </Text>
          </View>

          <View style={[styles.statCard, { marginLeft: 16 }]}>
            <View className="h-11 w-11 items-center justify-center rounded-full" style={styles.lessonBadge}>
              <Ionicons name="book" size={20} color={palette.success} />
            </View>
            <Text className="mt-4 text-xl font-extrabold" style={{ color: palette.text }}>
              {lessonsCompleted} Lessons
            </Text>
            <Text className="text-sm" style={{ color: palette.subtle }}>
              Completed
            </Text>
          </View>
        </View>

        <View className="mt-8 px-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold" style={{ color: palette.text }}>
              Review Queue
            </Text>
            <Text className="text-sm" style={{ color: palette.subtle }}>
              {reviewQueue?.total ?? 0} items
            </Text>
          </View>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <View className="rounded-full px-3 py-1" style={styles.reviewBadgePrimary}>
              <Text className="text-xs font-semibold" style={{ color: palette.primary }}>
                Due today: {reviewSummary?.dueTodayCount ?? 0}
              </Text>
            </View>
            <View className="rounded-full px-3 py-1" style={styles.reviewBadgeWarning}>
              <Text className="text-xs font-semibold" style={{ color: palette.cta }}>
                Overdue: {reviewSummary?.overdueCount ?? 0}
              </Text>
            </View>
            <View className="rounded-full px-3 py-1" style={styles.reviewBadgeNeutral}>
              <Text className="text-xs font-semibold" style={{ color: palette.muted }}>
                Total: {reviewSummary?.dueCount ?? 0}
              </Text>
            </View>
          </View>
          <View className="mt-4 rounded-3xl px-5 py-4" style={styles.cardShadow}>
            {(reviewQueue?.items || []).slice(0, 4).map((item) => (
              <View key={item.reviewQueueId} className="flex-row items-center justify-between py-2">
                <View>
                  <Text className="text-sm font-semibold" style={{ color: palette.text }}>
                    {item.source}
                  </Text>
                  <Text className="text-xs" style={{ color: palette.subtle }}>
                    Due {new Date(item.dueAt).toLocaleDateString()}
                  </Text>
                </View>
                <View className="rounded-full px-3 py-1" style={styles.reviewBadgePrimary}>
                  <Text className="text-xs font-semibold" style={{ color: palette.primary }}>
                    P{item.priority}
                  </Text>
                </View>
              </View>
            ))}
            {reviewQueue?.items?.length ? null : (
              <Text className="text-sm" style={{ color: palette.subtle }}>
                No items in your review queue right now.
              </Text>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/learn')}
          className="mx-6 mt-10 items-center justify-center rounded-full py-4"
          style={styles.primaryButton}
        >
          <Text className="text-base font-semibold text-white">Continue Learning</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: palette.background,
  },
  iconShadow: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  streakPill: {
    backgroundColor: '#FFE6D5',
    borderWidth: 1,
    borderColor: '#FFD4BC',
  },
  notificationBadge: {
    backgroundColor: '#EF4444',
  },
  ringShadow: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
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
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  xpBadge: {
    backgroundColor: '#FFE1CC',
  },
  lessonBadge: {
    backgroundColor: '#DCFCE7',
  },
  reviewBadgePrimary: {
    backgroundColor: '#E3E7FF',
  },
  reviewBadgeWarning: {
    backgroundColor: '#FFE9D6',
  },
  reviewBadgeNeutral: {
    backgroundColor: '#E9EDFF',
  },
  cardShadow: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
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
