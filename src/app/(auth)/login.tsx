import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Gradient Header Background */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 280,
        }}
      />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Hero Section with Floating Icon */}
            <View className="pt-8 pb-6 px-6 items-center">
              {/* Animated Floating Icon */}
              <View 
                className="mb-6 items-center justify-center"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center">
                  <Ionicons name="school" size={40} color="#3B82F6" />
                </View>
              </View>

              {/* Header Text */}
              <View className="items-center mb-2">
                <Text className="text-3xl font-extrabold text-white mb-2">
                  Welcome Back!
                </Text>
                <Text className="text-base text-blue-100 text-center px-8">
                  Sign in to continue your learning journey
                </Text>
              </View>
            </View>

            {/* Form Card Container */}
            <View 
              className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl px-6 pt-8 -mt-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
