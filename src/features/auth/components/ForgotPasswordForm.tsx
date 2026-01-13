import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas';
import { getUserFriendlyError } from '@/shared/utils/errorMessages';
import { authService } from '../services/auth.service';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  onBack?: () => void;
}

export function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const forgotPasswordMutation = useForgotPassword();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Step 1: Check if email exists
      setIsCheckingEmail(true);
      const checkResult = await authService.checkEmail({ email: data.email });
      setIsCheckingEmail(false);

      if (!checkResult.exists) {
        setError('root', { 
          message: 'Email này chưa được đăng ký. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.' 
        });
        return;
      }

      // Step 2: Send OTP email
      await forgotPasswordMutation.mutateAsync(data);
      onSuccess?.(data.email);
    } catch (error) {
      setIsCheckingEmail(false);
      const errorMessage = getUserFriendlyError(error);
      setError('root', { message: errorMessage });
    }
  };

  const isLoading = isCheckingEmail || forgotPasswordMutation.isPending;

  return (
    <View className="w-full">
      <Text className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã 6 số để đặt lại mật khẩu.
      </Text>

      {/* Email Input */}
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
            error={errors.email?.message}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            iconLeft={<MaterialIcons name="email" size={20} color={AppColors.icon.email} />}
          />
        )}
      />

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
        isLoading={isLoading}
        disabled={isLoading}
        className="mb-4"
      >
        {isCheckingEmail ? 'Đang kiểm tra...' : 'Gửi mã xác nhận'}
      </Button>

      {/* Back Button */}
      <Button
        variant="ghost"
        onPress={onBack}
        disabled={isLoading}
      >
        Quay lại đăng nhập
      </Button>
    </View>
  );
}
