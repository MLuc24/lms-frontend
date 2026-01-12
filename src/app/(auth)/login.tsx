import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mascot Icon */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl items-center justify-center">
              <View className="w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center">
                <Ionicons name="school" size={32} color="#ffffff" />
              </View>
            </View>
          </View>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Hello there!
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
              Welcome back to your learning journey
            </Text>
          </View>

          {/* Login Form */}
          <LoginForm
            onSuccess={() => {
              // Navigation handled inside LoginForm
            }}
            onForgotPassword={() => {
              router.push('/(auth)/forgot-password');
            }}
            onRegister={() => {
              router.push('/(auth)/register');
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
