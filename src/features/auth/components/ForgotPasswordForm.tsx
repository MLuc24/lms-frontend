import React, { useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas';
import { getUserFriendlyError } from '@/shared/utils/errorMessages';
import { authService } from '../services/auth.service';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  onBack?: () => void;
}

export function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const forgotPasswordMutation = useForgotPassword();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

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

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

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
        shakeError();
        return;
      }

      // Step 2: Send OTP email
      await forgotPasswordMutation.mutateAsync(data);
      onSuccess?.(data.email);
    } catch (error) {
      setIsCheckingEmail(false);
      const errorMessage = getUserFriendlyError(error);
      setError('root', { message: errorMessage });
      shakeError();
    }
  };

  const isLoading = isCheckingEmail || forgotPasswordMutation.isPending;

  return (
    <View className="w-full">
      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Địa chỉ Email"
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
        <Animated.View 
          style={{ transform: [{ translateX: shakeAnim }] }}
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <View className="flex-row items-start">
            <Ionicons name="alert-circle" size={20} color="#EF4444" style={{ marginRight: 8, marginTop: 1 }} />
            <Text className="text-sm text-red-600 dark:text-red-400 flex-1">
              {errors.root.message}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Submit Button */}
      <Button
        variant="gradient"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        disabled={isLoading}
        className="mb-4"
      >
        <View className="flex-row items-center">
          {!isLoading && <Ionicons name="send" size={18} color="white" style={{ marginRight: 8 }} />}
          <Text className="text-white font-semibold text-base">
            {isCheckingEmail ? 'Đang kiểm tra...' : 'Gửi mã xác thực'}
          </Text>
        </View>
      </Button>

      {/* Back Button */}
      <Button
        variant="ghost"
        onPress={onBack}
        disabled={isLoading}
      >
        <View className="flex-row items-center">
          <Ionicons name="arrow-back" size={18} color="#6B7280" style={{ marginRight: 8 }} />
          <Text className="text-gray-700 dark:text-gray-300 font-medium text-base">
            Quay lại đăng nhập
          </Text>
        </View>
      </Button>
    </View>
  );
}
