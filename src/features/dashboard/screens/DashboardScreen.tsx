import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProgressRing } from '@/shared/components/ProgressRing';

const palette = {
  primary: '#2D7CFF',
  background: '#F7F8FA',
  text: '#0F172A',
  muted: '#64748B',
  subtle: '#94A3B8',
  border: '#E8EDF5',
  warning: '#F97316',
  success: '#22C55E',
};

const progressData = {
  minutes: 24,
  progress: 72,
  streak: 5,
  xp: 450,
  lessons: 3,
};

export function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ringSize = Math.min(width * 0.72, 260);
  const ringStroke = Math.max(10, Math.round(ringSize * 0.08));

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: palette.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-2">
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
              style={styles.iconShadow}
            >
              <Ionicons name="arrow-back" size={20} color={palette.text} />
            </Pressable>

            <Text className="text-base font-semibold" style={{ color: palette.text }}>
              Today's Progress
            </Text>

            <View className="flex-row items-center rounded-full bg-[#FFF1E6] px-3 py-1">
              <Ionicons name="flame" size={16} color={palette.warning} />
              <Text className="ml-1 text-sm font-semibold" style={{ color: palette.warning }}>
                {progressData.streak} Days
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-10 items-center px-6">
          <View style={styles.ringShadow}>
            <ProgressRing
              size={ringSize}
              strokeWidth={ringStroke}
              progress={progressData.progress}
              color={palette.primary}
              trackColor={palette.border}
            >
              <View className="items-center">
                <Text className="text-4xl font-extrabold" style={{ color: palette.text }}>
                  {progressData.minutes}
                </Text>
                <Text className="mt-1 text-sm" style={{ color: palette.subtle }}>
                  Minutes Learned
                </Text>
              </View>
            </ProgressRing>
          </View>

          <Text className="mt-6 text-center text-sm" style={{ color: palette.muted }}>
            You're crushing your daily goal! Just a few more minutes to reach your target.
          </Text>
        </View>

        <View className="mt-8 flex-row px-6">
          <View style={styles.statCard}>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FFF7ED]">
              <Ionicons name="flash" size={20} color={palette.warning} />
            </View>
            <Text className="mt-4 text-xl font-extrabold" style={{ color: palette.text }}>
              {progressData.xp} XP
            </Text>
            <Text className="text-sm" style={{ color: palette.subtle }}>
              Earned Today
            </Text>
          </View>

          <View style={[styles.statCard, { marginLeft: 16 }]}>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7]">
              <Ionicons name="book" size={20} color={palette.success} />
            </View>
            <Text className="mt-4 text-xl font-extrabold" style={{ color: palette.text }}>
              {progressData.lessons} Lessons
            </Text>
            <Text className="text-sm" style={{ color: palette.subtle }}>
              Completed
            </Text>
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
  iconShadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  ringShadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
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
    shadowRadius: 18,
    elevation: 5,
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
