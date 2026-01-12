import React from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface ResetPasswordFormProps {
  email?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export function ResetPasswordForm({ email, onSuccess, onBack }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
      otpCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email: data.email,
        otpCode: data.otpCode,
        newPassword: data.newPassword,
      });
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  return (
    <View className="w-full">
      <Text className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        Enter the 6-digit code sent to your email and create a new password.
      </Text>

      {/* Email (read-only if provided) */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!email}
            error={errors.email?.message}
            iconLeft={<MaterialIcons name="email" size={20} color={AppColors.icon.email} />}
          />
        )}
      />

      {/* OTP Code */}
      <Controller
        control={control}
        name="otpCode"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Verification Code"
            value={value}
            onChangeText={onChange}
            placeholder="000000"
            keyboardType="numeric"
            error={errors.otpCode?.message}
            iconLeft={<MaterialIcons name="verified-user" size={20} color={AppColors.primary[500]} />}
          />
        )}
      />

      {/* New Password */}
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="New Password"
            value={value}
            onChangeText={onChange}
            placeholder="Min 8 characters"
            secureTextEntry={true}
            showPasswordToggle={true}
            autoComplete="password"
            error={errors.newPassword?.message}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
          />
        )}
      />

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Confirm New Password"
            value={value}
            onChangeText={onChange}
            placeholder="Re-enter password"
            secureTextEntry={true}
            showPasswordToggle={true}
            error={errors.confirmPassword?.message}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
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
        isLoading={resetPasswordMutation.isPending}
        disabled={resetPasswordMutation.isPending}
        className="mb-4"
      >
        Reset Password
      </Button>

      {/* Back Button */}
      <Button
        variant="ghost"
        onPress={onBack}
        disabled={resetPasswordMutation.isPending}
      >
        Back
      </Button>
    </View>
  );
}
