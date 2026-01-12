import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, type RegisterFormData } from '../schemas';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

// Helper function to calculate password strength
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthLabel = (strength: number): string => {
  if (strength <= 1) return 'Weak';
  if (strength === 2) return 'Fair';
  if (strength === 3) return 'Medium';
  return 'Strong';
};

export function RegisterForm({ onSuccess, onLogin }: RegisterFormProps) {
  const registerMutation = useRegister();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
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

  const password = watch('password');
  const passwordStrength = calculatePasswordStrength(password || '');

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeToTerms) {
      setError('root', { message: 'Please agree to the Terms & Conditions' });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email: data.email,
        phone: undefined,
        password: data.password,
        displayName: data.email?.split('@')[0] || 'User',
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
      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email"
            value={value || ''}
            onChangeText={onChange}
            placeholder="hello@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.message}
            iconLeft={<MaterialIcons name="email" size={20} color={AppColors.icon.email} />}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <View>
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your password"
              secureTextEntry={true}
              showPasswordToggle={true}
              autoComplete="password"
              error={errors.password?.message}
              iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
            />
            {/* Password Strength Indicator */}
            {value && (
              <View className="mb-4 -mt-2">
                <View className="flex-row gap-1 mb-2">
                  {[0, 1, 2, 3].map((index) => (
                    <View
                      key={index}
                      className={`flex-1 h-1 rounded-full ${index < passwordStrength
                          ? passwordStrength <= 1
                            ? 'bg-red-500'
                            : passwordStrength === 2
                              ? 'bg-yellow-500'
                              : passwordStrength === 3
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                    />
                  ))}
                </View>
                <Text
                  className={`text-xs font-medium ${passwordStrength <= 1
                      ? 'text-red-500'
                      : passwordStrength === 2
                        ? 'text-yellow-500'
                        : passwordStrength === 3
                          ? 'text-blue-500'
                          : 'text-green-500'
                    }`}
                >
                  {getStrengthLabel(passwordStrength)}
                </Text>
              </View>
            )}
          </View>
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
            placeholder="Re-enter your password"
            secureTextEntry={true}
            showPasswordToggle={true}
            error={errors.confirmPassword?.message}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
          />
        )}
      />

      {/* Terms & Conditions Checkbox */}
      <Pressable
        onPress={() => setAgreeToTerms(!agreeToTerms)}
        className="flex-row items-center mb-6"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreeToTerms }}
      >
        <View
          className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${agreeToTerms
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
        >
          {agreeToTerms && <Ionicons name="checkmark" size={16} color="#ffffff" />}
        </View>
        <Text className="text-sm text-gray-700 dark:text-gray-300">
          I agree to the{' '}
          <Text className="text-blue-500 font-medium">Terms & Conditions</Text>
        </Text>
      </Pressable>

      {/* Error Message */}
      {errors.root && (
        <Text className="text-sm text-red-500 mb-4 text-center">
          {errors.root.message}
        </Text>
      )}

      {/* Create Account Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={registerMutation.isPending}
        disabled={registerMutation.isPending}
        className="mb-4"
        variant="primary"
        size="lg"
      >
        Create Account
      </Button>

      {/* Divider */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <Text className="mx-4 text-gray-500 dark:text-gray-400">Or sign up with</Text>
        <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </View>

      {/* Social Login Buttons */}
      <View className="flex-row justify-center gap-4 mb-6">
        {/* Google Sign In */}
        <Pressable
          className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Sign up with Google"
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </Pressable>

        {/* Apple Sign In */}
        <Pressable
          className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Sign up with Apple"
        >
          <Ionicons name="logo-apple" size={24} color="#000000" />
        </Pressable>
      </View>

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
          <Text className="text-blue-500 font-semibold">
            Log In
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
