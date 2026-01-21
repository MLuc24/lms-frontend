import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useHomeContinue, useHomeSummary } from '@/features/home/hooks';
import { useProgressWeekly, useStreak } from '@/features/dashboard/hooks';
import { getTimeZone } from '@/shared/utils/timezone';
import { formatMonthRange, getShortDayLabel, getWeekStartISO } from '@/shared/utils/date';

const palette = {
  primary: '#4F46E5',
  secondary: '#818CF8',
  cta: '#F97316',
  background: '#EEF2FF',
  text: '#1E1B4B',
  muted: '#58558A',
  subtle: '#7C7AA8',
  border: '#C7D2FE',
  surface: '#FFFFFF',
};

const statusStyles = {
  done: { backgroundColor: palette.primary, borderColor: palette.primary },
  today: { backgroundColor: palette.surface, borderColor: palette.secondary, dashed: true },
  missed: { backgroundColor: '#E5E7F5', borderColor: '#E5E7F5' },
  future: { backgroundColor: '#F1F3FF', borderColor: '#F1F3FF' },
  frozen: { backgroundColor: '#FDE68A', borderColor: palette.cta },
};

export default function StreakDetailScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const timeZone = getTimeZone();
  const weekStartIso = getWeekStartISO(new Date());
  const { data: streak } = useStreak(timeZone, isAuthenticated);
  const { data: weekly } = useProgressWeekly({ weekStart: weekStartIso, timeZone }, isAuthenticated);
  const { data: summary } = useHomeSummary(isAuthenticated);
  const { data: continueData } = useHomeContinue(isAuthenticated);
  const continueLearning = summary?.continueLearning ?? continueData?.continueLearning;
  const weekRange = weekly
    ? formatMonthRange(weekly.weekStart, weekly.weekEnd)
    : streak?.week
      ? formatMonthRange(streak.week.startDate, streak.week.endDate)
      : '';

  return (
    <SafeAreaView className="flex-1" style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close streak detail"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={styles.closeButton}
          >
            <Ionicons name="close" size={22} color={palette.text} />
          </Pressable>
        </View>

        <View className="px-6 pt-10 items-center">
          <View className="flex-row items-center">
            <Text className="text-[64px] font-extrabold" style={styles.textPrimary}>
              {streak?.currentDays ?? 0}
            </Text>
            <Ionicons name="flame" size={46} color={palette.cta} style={styles.flameIcon} />
          </View>
          <Text className="mt-4 text-3xl font-extrabold" style={styles.textPrimary}>
            Day Streak!
          </Text>
          <Text className="mt-2 text-base font-medium" style={styles.textMuted}>
            You are unstoppable.
          </Text>
        </View>

        <View className="mt-8 px-6">
          <View className="rounded-3xl px-5 py-6" style={styles.weekCard}>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold" style={styles.textPrimary}>
                This Week
              </Text>
              <Text className="text-sm font-semibold" style={styles.weekAccent}>
                {weekRange || 'This week'}
              </Text>
            </View>
            <View className="mt-5 flex-row items-center justify-between">
              {(streak?.week?.days || []).slice(0, 7).map((day) => {
                const style = statusStyles[day.status];
                const dayNumber = new Date(day.date).getDate();
                return (
                  <View key={day.date} className="items-center">
                    <Text className="text-xs font-semibold" style={styles.textMuted}>
                      {getShortDayLabel(day.date)}
                    </Text>
                    <View
                      className="mt-2 h-12 w-12 items-center justify-center rounded-full border-2"
                      style={{
                        backgroundColor: style.backgroundColor,
                        borderColor: style.borderColor,
                        borderStyle: style.dashed ? 'dashed' : 'solid',
                      }}
                    >
                      {day.status === 'done' ? (
                        <Ionicons name="checkmark" size={18} color="#ffffff" />
                      ) : day.status === 'frozen' ? (
                        <Ionicons name="snow" size={16} color={palette.cta} />
                      ) : (
                        <Text className="text-sm font-semibold" style={styles.textMuted}>
                          {dayNumber}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mt-8 px-6">
          <LinearGradient
            colors={['#f97316', '#f59e0b', '#4f46e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6"
            style={styles.gradientCard}
          >
            <View className="rounded-full bg-white/20 px-4 py-1.5 self-start">
              <Text className="text-xs font-semibold text-white">
                MOTIVATIONAL BOOST
              </Text>
            </View>
            <Text className="mt-4 text-2xl font-extrabold text-white">
              Keep it going!
            </Text>
            <Text className="mt-2 text-sm text-white/90">
              Practice for 5 mins to keep your streak alive.
            </Text>
          </LinearGradient>
        </View>

        <View className="mt-8 px-6">
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              continueLearning?.lessonId
                ? router.push(`/lesson/${continueLearning.lessonId}`)
                : router.push('/(tabs)/learn')
            }
            className="items-center justify-center rounded-full py-4"
            style={styles.ctaButton}
          >
            <Text className="text-base font-semibold text-white">
              Start Today&apos;s Lesson
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-4 items-center"
          >
            <Text className="text-sm font-semibold" style={styles.textSubtle}>
              Maybe later
            </Text>
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
  closeButton: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  flameIcon: {
    marginLeft: 6,
  },
  textPrimary: {
    color: palette.text,
  },
  textMuted: {
    color: palette.muted,
  },
  textSubtle: {
    color: palette.subtle,
  },
  weekAccent: {
    color: palette.primary,
  },
  weekCard: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  gradientCard: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaButton: {
    backgroundColor: palette.primary,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
});
