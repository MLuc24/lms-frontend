import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, type RegisterFormData } from '../schemas';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

export function RegisterForm({ onSuccess, onLogin }: RegisterFormProps) {
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        email: registerMethod === 'email' ? data.email : undefined,
        phone: registerMethod === 'phone' ? data.phone : undefined,
        password: data.password,
        displayName: data.displayName,
      });

      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  return (
    <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
      {/* Register Method Toggle */}
      <View className="flex-row mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <Pressable
          onPress={() => setRegisterMethod('email')}
          className={`flex-1 py-2 rounded-md ${
            registerMethod === 'email'
              ? 'bg-white dark:bg-gray-700'
              : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              registerMethod === 'email'
                ? 'text-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Email
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setRegisterMethod('phone')}
          className={`flex-1 py-2 rounded-md ${
            registerMethod === 'phone'
              ? 'bg-white dark:bg-gray-700'
              : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              registerMethod === 'phone'
                ? 'text-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Phone
          </Text>
        </Pressable>
      </View>

      {/* Display Name */}
      <Controller
        control={control}
        name="displayName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Display Name"
            value={value}
            onChangeText={onChange}
            placeholder="John Doe"
            autoCapitalize="words"
            autoComplete="name"
            error={errors.displayName?.message}
          />
        )}
      />

      {/* Email or Phone Input */}
      {registerMethod === 'email' ? (
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

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            placeholder="Min 8 characters"
            secureTextEntry={true}
            showPasswordToggle={true}
            autoComplete="password"
            error={errors.password?.message}
          />
        )}
      />

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            placeholder="Re-enter password"
            secureTextEntry={true}
            showPasswordToggle={true}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      {/* Password Requirements */}
      <View className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Password must contain:
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • At least 8 characters
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • One uppercase letter
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • One lowercase letter
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • One number
        </Text>
      </View>

      {/* Error Message */}
      {errors.root && (
        <Text className="text-sm text-red-500 mb-4 text-center">
          {errors.root.message}
        </Text>
      )}

      {/* Submit Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={registerMutation.isPending}
        disabled={registerMutation.isPending}
        className="mb-4"
      >
        Create Account
      </Button>

      {/* Login Link */}
      <View className="flex-row justify-center mb-6">
        <Text className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
        </Text>
        <Pressable
          onPress={onLogin}
          accessibilityRole="button"
          accessibilityLabel="Login"
        >
          <Text className="text-primary-500 font-semibold">
            Login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
