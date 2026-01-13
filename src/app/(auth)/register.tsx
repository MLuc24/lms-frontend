import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Gradient Header Background */}
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 240,
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
            {/* Header with Back Button */}
            <View className="pt-4 pb-6 px-6">
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mb-6 active:bg-white/30"
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>

              {/* Hero Icon */}
              <View 
                className="mb-4 items-center justify-center self-start"
                style={{
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center">
                  <Ionicons name="rocket" size={32} color="#10B981" />
                </View>
              </View>

              {/* Header Text */}
              <View className="mb-2">
                <Text className="text-3xl font-extrabold text-white mb-2">
                  Join Us Today
                </Text>
                <Text className="text-base text-green-100">
                  Create your account and start learning
                </Text>
              </View>
            </View>

            {/* Form Card Container */}
            <View 
              className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl px-6 pt-6 -mt-2"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <RegisterForm
                onSuccess={() => {
                  router.replace('/(auth)/login');
                }}
                onLogin={() => {
                  router.back();
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
