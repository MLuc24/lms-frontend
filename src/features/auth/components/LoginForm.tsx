import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormData } from '../schemas';
import { router } from 'expo-router';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
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
        email: loginMethod === 'email' ? data.email : undefined,
        phone: loginMethod === 'phone' ? data.phone : undefined,
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

  return (
    <View className="w-full">
      {/* Login Method Toggle */}
      <View className="flex-row mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <Pressable
          onPress={() => setLoginMethod('email')}
          className={`flex-1 py-2 rounded-md ${
            loginMethod === 'email'
              ? 'bg-white dark:bg-gray-700'
              : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              loginMethod === 'email'
                ? 'text-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Email
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setLoginMethod('phone')}
          className={`flex-1 py-2 rounded-md ${
            loginMethod === 'phone'
              ? 'bg-white dark:bg-gray-700'
              : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              loginMethod === 'phone'
                ? 'text-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Phone
          </Text>
        </Pressable>
      </View>

      {/* Email or Phone Input */}
      {loginMethod === 'email' ? (
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              value={value || ''}
              onChangeText={onChange}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email?.message}
            />
          )}
        />
      ) : (
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Phone Number"
              value={value || ''}
              onChangeText={onChange}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              autoComplete="tel"
              error={errors.phone?.message}
            />
          )}
        />
      )}

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            placeholder="Enter your password"
            secureTextEntry={true}
            showPasswordToggle={true}
            autoComplete="password"
            error={errors.password?.message}
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
        <Text className="text-sm text-primary-500 font-medium">
          Forgot Password?
        </Text>
      </Pressable>

      {/* Error Message */}
      {errors.root && (
        <Text className="text-sm text-red-500 mb-4 text-center">
          {errors.root.message}
        </Text>
      )}

      {/* Submit Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={loginMutation.isPending}
        disabled={loginMutation.isPending}
        className="mb-4"
      >
        Login
      </Button>

      {/* Register Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
        </Text>
        <Pressable
          onPress={onRegister}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          <Text className="text-primary-500 font-semibold">
            Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
