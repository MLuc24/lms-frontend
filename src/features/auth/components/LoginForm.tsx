import React, { useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormData } from '../schemas';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const loginMutation = useLogin();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        phone: undefined,
        password: data.password,
      });

      onSuccess?.();
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="w-full">
      {/* Social Login Buttons */}
      <View className="mb-6">
        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center mb-3">
          QUICK SIGN IN
        </Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => handleSocialLogin('google')}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 items-center justify-center active:scale-95"
            style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
          >
            <Ionicons name="logo-google" size={24} color="#EA4335" />
          </Pressable>
          <Pressable
            onPress={() => handleSocialLogin('apple')}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 items-center justify-center active:scale-95"
            style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
          >
            <Ionicons name="logo-apple" size={24} color="#000" />
          </Pressable>
          <Pressable
            onPress={() => handleSocialLogin('facebook')}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 items-center justify-center active:scale-95"
            style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
          >
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          </Pressable>
        </View>
      </View>

      {/* Divider */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <Text className="mx-4 text-xs font-medium text-gray-400 dark:text-gray-500">OR CONTINUE WITH EMAIL</Text>
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </View>

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input
              label="Email address"
              value={value || ''}
              onChangeText={onChange}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email?.message}
              iconLeft={<MaterialIcons name="email" size={20} color={focusedField === 'email' ? '#3B82F6' : AppColors.icon.email} />}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <View className="mb-2">
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your password"
              secureTextEntry={true}
              showPasswordToggle={true}
              autoComplete="password"
              error={errors.password?.message}
              iconLeft={<MaterialIcons name="lock" size={20} color={focusedField === 'password' ? '#3B82F6' : AppColors.icon.password} />}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}
      />

      {/* Forgot Password Link */}
      <Pressable
        onPress={onForgotPassword}
        className="self-end mb-6"
        accessibilityRole="button"
        accessibilityLabel="Forgot password"
      >
        <Text className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
          Forgot Password?
        </Text>
      </Pressable>

      {/* Error Message with Icon */}
      {errors.root && (
        <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex-row items-start">
          <Ionicons name="alert-circle" size={20} color="#EF4444" style={{ marginRight: 8, marginTop: 2 }} />
          <Text className="text-sm text-red-600 dark:text-red-400 flex-1">
            {errors.root.message}
          </Text>
        </View>
      )}

      {/* Login Button with Gradient */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={loginMutation.isPending}
        disabled={loginMutation.isPending}
        className="mb-4"
        variant="gradient"
        size="lg"
      >
        <View className="flex-row items-center">
          {!loginMutation.isPending && (
            <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text className="text-white font-bold text-base">
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </Text>
        </View>
      </Button>

      {/* Register Link */}
      <View className="flex-row justify-center mb-6">
        <Text className="text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account?{' '}
        </Text>
        <Pressable
          onPress={onRegister}
          accessibilityRole="button"
          accessibilityLabel="Create account"
          className="active:opacity-70"
        >
          <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">
            Sign Up Free
          </Text>
        </Pressable>
      </View>

      {/* Guest Mode - More subtle */}
      <Pressable
        onPress={handleGuestLogin}
        className="py-3 items-center active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Continue as guest"
      >
        <View className="flex-row items-center">
          <Ionicons name="eye-outline" size={16} color="#9CA3AF" style={{ marginRight: 6 }} />
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Just browsing? Continue as Guest
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
