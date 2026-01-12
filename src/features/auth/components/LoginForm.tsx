import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormData } from '../schemas';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const loginMutation = useLogin();

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
      // Navigate to home after successful login
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  const handleGuestLogin = () => {
    // Navigate to home without authentication
    router.replace('/(tabs)');
  };

  return (
    <View className="w-full">
      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email address"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.message}
            iconLeft={<MaterialIcons name="email" size={20} color={AppColors.icon.email} />}
          />
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            placeholder="Password"
            secureTextEntry={true}
            showPasswordToggle={true}
            autoComplete="password"
            error={errors.password?.message}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
          />
        )}
      />

      {/* Forgot Password Link */}
      <Pressable
        onPress={onForgotPassword}
        className="self-end mb-6"
        accessibilityRole="button"
        accessibilityLabel="Forgot password"
      >
        <Text className="text-sm text-blue-500 font-medium">
          Forgot Password?
        </Text>
      </Pressable>

      {/* Error Message */}
      {errors.root && (
        <Text className="text-sm text-red-500 mb-4 text-center">
          {errors.root.message}
        </Text>
      )}

      {/* Login Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={loginMutation.isPending}
        disabled={loginMutation.isPending}
        className="mb-4"
        variant="primary"
        size="lg"
      >
        Log in
      </Button>

      {/* Register Link */}
      <View className="flex-row justify-center mb-6">
        <Text className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
        </Text>
        <Pressable
          onPress={onRegister}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          <Text className="text-blue-500 font-semibold">
            Sign up
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <Text className="mx-4 text-gray-500 dark:text-gray-400">or</Text>
        <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </View>

      {/* Continue as Guest Button */}
      <Button
        onPress={handleGuestLogin}
        variant="outline"
        size="lg"
      >
        <View className="flex-row items-center">
          <Ionicons name="person" size={20} color={AppColors.icon.user} style={{ marginRight: 8 }} />
          <Text className="font-semibold text-gray-900 dark:text-white">Continue as Guest</Text>
        </View>
      </Button>
    </View>
  );
}
