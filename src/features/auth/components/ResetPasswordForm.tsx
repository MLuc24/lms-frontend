import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas';
import { getUserFriendlyError } from '@/shared/utils/errorMessages';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface ResetPasswordFormProps {
  email?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export function ResetPasswordForm({ email, onSuccess, onBack }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword();
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      const errorMessage = getUserFriendlyError(error);
      setError('root', { message: errorMessage });
    }
  };

  return (
    <View className="w-full">
      <Text className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        Nhập mã 6 số đã được gửi đến email của bạn và tạo mật khẩu mới.
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
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
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
            label="Mã xác nhận"
            value={value}
            onChangeText={onChange}
            placeholder="000000"
            keyboardType="numeric"
            maxLength={6}
            error={errors.otpCode?.message}
            onFocus={() => setFocusedField('otpCode')}
            onBlur={() => setFocusedField(null)}
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
            label="Mật khẩu mới"
            value={value}
            onChangeText={onChange}
            placeholder="Tối thiểu 8 ký tự"
            secureTextEntry={true}
            showPasswordToggle={true}
            autoComplete="password"
            error={errors.newPassword?.message}
            onFocus={() => setFocusedField('newPassword')}
            onBlur={() => setFocusedField(null)}
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
            label="Xác nhận mật khẩu mới"
            value={value}
            onChangeText={onChange}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={true}
            showPasswordToggle={true}
            error={errors.confirmPassword?.message}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
          />
        )}
      />

      {/* Password Requirements */}
      <View className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Mật khẩu phải chứa:
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • Ít nhất 8 ký tự
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • Một chữ hoa
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • Một chữ thường
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          • Một chữ số
        </Text>
      </View>

      {/* Error Message */}
      {errors.root && (
        <View className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <Text className="text-sm text-red-600 dark:text-red-400 text-center">
            {errors.root.message}
          </Text>
        </View>
      )}

      {/* Submit Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={resetPasswordMutation.isPending}
        disabled={resetPasswordMutation.isPending}
        className="mb-4"
      >
        Đặt lại mật khẩu
      </Button>

      {/* Back Button */}
      <Button
        variant="ghost"
        onPress={onBack}
        disabled={resetPasswordMutation.isPending}
      >
        Quay lại
      </Button>
    </View>
  );
}
