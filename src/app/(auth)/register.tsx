import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center mb-6"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>

          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              Start your learning journey today.
            </Text>
          </View>

          {/* Register Form */}
          <RegisterForm
            onSuccess={() => {
              // Show success message and navigate to login
              router.replace('/(auth)/login');
              // TODO: Show toast/alert about email verification
            }}
            onLogin={() => {
              router.back();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
