/**
 * Dashboard Test Screen
 * Test all home dashboard APIs
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useHomeDashboard,
  useProgress,
  useReview,
  useNotification,
} from '../../home/hooks/useHomeDashboard';
import { usePracticeSession } from '../../practice/hooks/usePracticeSession';

export const DashboardTestScreen = () => {
  const dashboard = useHomeDashboard();
  const progress = useProgress();
  const review = useReview();
  const notification = useNotification();
  const practiceSession = usePracticeSession();

  const [todayProgress, setTodayProgress] = useState<any>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [reviewSummary, setReviewSummary] = useState<any>(null);
  const [reviewQueue, setReviewQueue] = useState<any>(null);
  const [notificationSummary, setNotificationSummary] = useState<any>(null);

  // Load dashboard on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      await dashboard.fetchSummary();
      Alert.alert('Success', 'Dashboard loaded successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to load dashboard');
    }
  };

  const loadTodayProgress = async () => {
    try {
      const data = await progress.fetchToday();
      setTodayProgress(data);
      Alert.alert('Success', `Today: ${data.minutesLearned} minutes, ${data.xpEarned} XP`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const loadWeeklyProgress = async () => {
    try {
      const data = await progress.fetchWeekly();
      setWeeklyProgress(data);
      Alert.alert('Success', `Week: ${data.days.length} days loaded`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const loadStreak = async () => {
    try {
      const data = await progress.fetchStreak();
      setStreakData(data);
      Alert.alert('Success', `Streak: ${data.currentDays} days (longest: ${data.longestDays})`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const loadReviewSummary = async () => {
    try {
      const data = await review.fetchSummary();
      setReviewSummary(data);
      Alert.alert('Success', `Review: ${data.dueCount} items due`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const loadReviewQueue = async () => {
    try {
      const data = await review.fetchQueue({ limit: 5 });
      setReviewQueue(data);
      Alert.alert('Success', `Queue: ${data.items.length} items loaded`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const loadNotificationSummary = async () => {
    try {
      const data = await notification.fetchSummary();
      setNotificationSummary(data);
      Alert.alert('Success', `Notifications: ${data.unreadCount} unread`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const testStartSession = async () => {
    if (!dashboard.data?.continueLearning) {
      Alert.alert('Error', 'No lesson available. Load dashboard first.');
      return;
    }

    try {
      const lessonId = dashboard.data.continueLearning.lessonId;
      const session = await practiceSession.startSession(lessonId, 'learn');
      Alert.alert('Success', `Session started: ${session.sessionId}`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const testEndSession = async () => {
    if (!practiceSession.currentSession) {
      Alert.alert('Error', 'No active session. Start a session first.');
      return;
    }

    try {
      const result = await practiceSession.endSession();
      Alert.alert('Success', `Session ended: ${result.durationMinutes} minutes`);
      // Refresh dashboard to see updated data
      await dashboard.refresh();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const testSubmitReview = async () => {
    if (!reviewQueue || reviewQueue.items.length === 0) {
      Alert.alert('Error', 'No review items. Load review queue first.');
      return;
    }

    try {
      const firstItem = reviewQueue.items[0];
      const result = await review.submitReview(firstItem.itemId, true, 'Test answer');
      Alert.alert('Success', `Review submitted! Next review: ${result.intervalDays} days`);
      // Refresh review summary
      await loadReviewSummary();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const testMarkAllNotificationsRead = async () => {
    try {
      const result = await notification.markAllAsRead();
      Alert.alert('Success', `Marked ${result.markedCount} notifications as read`);
      // Refresh notification summary
      await loadNotificationSummary();
      // Refresh dashboard
      await dashboard.refresh();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed');
    }
  };

  const renderButton = (title: string, onPress: () => void, loading?: boolean) => (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard API Test</Text>

      {/* Dashboard Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dashboard Summary</Text>
        {renderButton('Load Dashboard', loadDashboard, dashboard.loading)}
        {dashboard.data && (
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>
              User: {dashboard.data.user.displayName}
            </Text>
            <Text style={styles.dataText}>
              Course: {dashboard.data.continueLearning?.courseTitle || 'None'}
            </Text>
            <Text style={styles.dataText}>
              Progress: {dashboard.data.continueLearning?.completedLessons || 0}/
              {dashboard.data.continueLearning?.totalLessons || 0} lessons
            </Text>
            <Text style={styles.dataText}>
              Daily Goal: {dashboard.data.dailyGoal.learnedMinutes}/
              {dashboard.data.dailyGoal.targetMinutes} min (
              {dashboard.data.dailyGoal.progressPercent}%)
            </Text>
            <Text style={styles.dataText}>
              Streak: {dashboard.data.streak.currentDays} days
            </Text>
            <Text style={styles.dataText}>
              Review: {dashboard.data.review.dueCount} items
            </Text>
            <Text style={styles.dataText}>
              Notifications: {dashboard.data.notifications.unreadCount} unread
            </Text>
          </View>
        )}
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>
        {renderButton('Today Progress', loadTodayProgress, progress.loading)}
        {renderButton('Weekly Progress', loadWeeklyProgress, progress.loading)}
        {renderButton('Streak', loadStreak, progress.loading)}
        {todayProgress && (
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>
              Today: {todayProgress.minutesLearned} min, {todayProgress.xpEarned} XP
            </Text>
          </View>
        )}
      </View>

      {/* Review */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review</Text>
        {renderButton('Review Summary', loadReviewSummary, review.loading)}
        {renderButton('Review Queue', loadReviewQueue, review.loading)}
        {renderButton('Submit Review (Test)', testSubmitReview, review.loading)}
        {reviewSummary && (
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>
              Due: {reviewSummary.dueCount} items
            </Text>
            <Text style={styles.dataText}>
              Overdue: {reviewSummary.overdueCount} items
            </Text>
          </View>
        )}
      </View>

      {/* Practice Session */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Practice Session</Text>
        {renderButton('Start Session', testStartSession, practiceSession.loading)}
        {renderButton('End Session', testEndSession, practiceSession.loading)}
        {practiceSession.currentSession && (
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>
              Active Session: {practiceSession.currentSession.sessionId}
            </Text>
            <Text style={styles.dataText}>
              Mode: {practiceSession.currentSession.mode}
            </Text>
          </View>
        )}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {renderButton('Notification Summary', loadNotificationSummary, notification.loading)}
        {renderButton('Mark All Read', testMarkAllNotificationsRead, notification.loading)}
        {notificationSummary && (
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>
              Unread: {notificationSummary.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dataBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  dataText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  spacer: {
    height: 40,
  },
});
