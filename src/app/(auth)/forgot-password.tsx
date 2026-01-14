import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Alert } from 'react-native';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const getStepIcon = () => {
    return step === 'request' ? 'mail-outline' : 'key-outline';
  };

  const getStepTitle = () => {
    return step === 'request' ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu';
  };

  const getStepDescription = () => {
    return step === 'request' 
      ? 'Nhập email để nhận mã xác thực'
      : 'Nhập mã và mật khẩu mới';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Background Gradient */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute top-0 left-0 right-0 h-64 opacity-10"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step Indicator */}
          <View className="mb-6">
            <View className="flex-row items-center justify-center mb-3">
              {['request', 'reset'].map((s, index) => (
                <React.Fragment key={s}>
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      step === s
                        ? 'bg-blue-600'
                        : index < ['request', 'reset'].indexOf(step)
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    {index < ['request', 'reset'].indexOf(step) ? (
                      <Ionicons name="checkmark" size={20} color="white" />
                    ) : (
                      <Text className="text-white font-bold">{index + 1}</Text>
                    )}
                  </View>
                  {index < 1 && (
                    <View
                      className={`h-1 w-20 mx-2 ${
                        index < ['request', 'reset'].indexOf(step)
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
            <View className="flex-row items-center justify-around">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Gửi mã</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">Đặt lại</Text>
            </View>
          </View>

          {/* Main Card */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <View className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 mb-6">
              {/* Header */}
              <View className="items-center mb-5">
                <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-3">
                  <Ionicons name={getStepIcon() as any} size={32} color="#3B82F6" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                  {getStepTitle()}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {getStepDescription()}
                </Text>
              </View>

              {/* Forms */}
              {step === 'request' && (
                <ForgotPasswordForm
                  onSuccess={(submittedEmail) => {
                    setEmail(submittedEmail);
                    setStep('reset');
                    fadeAnim.setValue(0);
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 500,
                      useNativeDriver: true,
                    }).start();
                  }}
                  onBack={() => {
                    router.back();
                  }}
                />
              )}
              
              {step === 'reset' && (
                <ResetPasswordForm
                  email={email}
                  onSuccess={() => {
                    Alert.alert(
                      'Thành công!',
                      'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.',
                      [
                        {
                          text: 'Đăng nhập',
                          onPress: () => router.replace('/(auth)/login'),
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                  onBack={() => {
                    setStep('request');
                    fadeAnim.setValue(0);
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 500,
                      useNativeDriver: true,
                    }).start();
                  }}
                />
              )}
            </View>
          </Animated.View>

          {/* Help Section */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={18} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text className="text-xs text-blue-700 dark:text-blue-200 flex-1">
                {step === 'request'
                  ? 'Email phải đã được đăng ký trong hệ thống'
                  : 'Kiểm tra hộp thư spam nếu không nhận được mã'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
