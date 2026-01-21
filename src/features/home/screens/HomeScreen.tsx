import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken';

const palette = {
  primary: '#2D7CFF',
  background: '#F7F8FA',
  text: '#0F172A',
  muted: '#64748B',
  subtle: '#94A3B8',
  border: '#EEF2F7',
  success: '#22C55E',
  warning: '#F97316',
  violet: '#7C3AED',
};

const continueLesson = {
  title: 'Intro to Spanish',
  subtitle: 'Lesson 4: Ordering Coffee',
  progress: 0.65,
  timeLeft: '15 mins left',
};

const dailyGoal = {
  current: 12,
  total: 20,
  improvement: '+10%',
};

const currentStreak = {
  days: 12,
  label: "You're on fire!",
};

export function HomeScreen() {
  const router = useRouter();
  const { profile, user, isAuthenticated } = useAuth();
  useRegisterPushToken(isAuthenticated);

  const displayName =
    profile?.displayName || user?.displayName || 'Alex';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const progressPercent = Math.round(continueLesson.progress * 100);
  const dailyGoalProgress = dailyGoal.current / dailyGoal.total;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: palette.background }}>
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
                <View className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-[#FFE8B6]">
                  <Ionicons name="hand-left" size={18} color="#F59E0B" />
                </View>
              </View>
              <Text className="mt-1 text-base" style={{ color: palette.muted }}>
                Ready to learn today?
              </Text>
            </View>

            <View className="relative">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FCE7C3]">
                <Text className="text-lg font-semibold" style={{ color: palette.text }}>
                  {avatarLetter}
                </Text>
              </View>
              <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-[#22C55E]" />
            </View>
          </View>

          <View style={styles.mainCard}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className="text-xs font-semibold"
                  style={{ color: palette.primary, letterSpacing: 2 }}
                >
                  CONTINUE LEARNING
                </Text>
                <Text className="mt-3 text-2xl font-extrabold" style={{ color: palette.text }}>
                  {continueLesson.title}
                </Text>
                <Text className="mt-1 text-base" style={{ color: palette.muted }}>
                  {continueLesson.subtitle}
                </Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFE9D5]">
                <Ionicons name="cafe" size={22} color={palette.warning} />
              </View>
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-sm font-semibold" style={{ color: palette.text }}>
                {progressPercent}% Complete
              </Text>
              <Text className="text-sm" style={{ color: palette.subtle }}>
                {continueLesson.timeLeft}
              </Text>
            </View>
            <View className="mt-3 h-2 w-full rounded-full bg-[#EEF2F7]">
              <View
                className="h-2 rounded-full"
                style={{ width: `${progressPercent}%`, backgroundColor: palette.primary }}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/learn')}
              className="mt-5 flex-row items-center justify-center rounded-full py-4"
              style={styles.primaryButton}
            >
              <Text className="text-base font-semibold text-white">Continue Lesson</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
            </Pressable>
          </View>

          <View className="mt-6 flex-row">
            <View style={styles.statCard}>
              <View className="flex-row items-center justify-between">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7]">
                  <Ionicons name="stopwatch" size={20} color={palette.success} />
                </View>
                <Text className="text-sm font-semibold" style={{ color: palette.success }}>
                  {dailyGoal.improvement}
                </Text>
              </View>
              <Text className="mt-4 text-sm" style={{ color: palette.muted }}>
                Daily Goal
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-2xl font-extrabold" style={{ color: palette.text }}>
                  {dailyGoal.current}
                </Text>
                <Text className="ml-1 text-sm" style={{ color: palette.subtle }}>
                  /{dailyGoal.total} min
                </Text>
              </View>
              <View className="mt-3 h-2 w-full rounded-full bg-[#EEF2F7]">
                <View
                  className="h-2 rounded-full"
                  style={{ width: `${dailyGoalProgress * 100}%`, backgroundColor: palette.success }}
                />
              </View>
            </View>

            <View style={[styles.statCard, { marginLeft: 16 }]}>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FEF3C7]">
                <Ionicons name="flame" size={20} color={palette.warning} />
              </View>
              <Text className="mt-4 text-sm" style={{ color: palette.muted }}>
                Current Streak
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-2xl font-extrabold" style={{ color: palette.text }}>
                  {currentStreak.days}
                </Text>
                <Text className="ml-1 text-sm" style={{ color: palette.subtle }}>
                  Days
                </Text>
              </View>
              <Text className="mt-2 text-sm font-semibold" style={{ color: palette.warning }}>
                {currentStreak.label}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(tabs)/dashboard')}
            className="mt-6 flex-row items-center justify-between rounded-3xl bg-white px-4 py-4"
            style={styles.cardShadow}
          >
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EDE9FE]">
                <Ionicons name="book" size={20} color={palette.violet} />
              </View>
              <View className="ml-3">
                <Text className="text-base font-semibold" style={{ color: palette.text }}>
                  Review Mistakes
                </Text>
                <Text className="text-sm" style={{ color: palette.subtle }}>
                  14 words to practice
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
  mainCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
  },
  cardShadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
});
