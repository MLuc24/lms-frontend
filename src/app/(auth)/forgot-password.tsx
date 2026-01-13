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
              {step === 'request' ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              {step === 'request'
                ? 'Đừng lo, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn'
                : 'Nhập mã xác nhận và tạo mật khẩu mới'}
            </Text>
          </View>

          {/* Forms */}
          {step === 'request' ? (
            <ForgotPasswordForm
              onSuccess={(submittedEmail) => {
                // Save email and move to reset step
                setEmail(submittedEmail);
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
