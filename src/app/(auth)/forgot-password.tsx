import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'request' ? 'Forgot Password?' : 'Reset Password'}
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              {step === 'request'
                ? "No worries, we'll send you reset instructions"
                : 'Enter the code and create a new password'}
            </Text>
          </View>

          {/* Forms */}
          {step === 'request' ? (
            <ForgotPasswordForm
              onSuccess={() => {
                // Move to reset step
                setStep('reset');
              }}
              onBack={() => {
                router.back();
              }}
            />
          ) : (
            <ResetPasswordForm
              email={email}
              onSuccess={() => {
                // Navigate back to login
                router.replace('/(auth)/login');
                // TODO: Show success toast
              }}
              onBack={() => {
                setStep('request');
              }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
