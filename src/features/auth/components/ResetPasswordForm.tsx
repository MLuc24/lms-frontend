import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useResetPassword } from '../hooks/useResetPassword';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas';
import { getUserFriendlyError } from '@/shared/utils/errorMessages';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface ResetPasswordFormProps {
  email?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export function ResetPasswordForm({ email, onSuccess, onBack }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword();
  const forgotPasswordMutation = useForgotPassword();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
      otpCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Pulse animation for timer
  useEffect(() => {
    if (timer <= 60 && timer > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [timer]);

  // Password strength calculator
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[a-z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 25;

    setPasswordStrength(strength);
  }, [newPassword]);

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleResendOTP = async () => {
    if (!canResend || !email) return;

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setTimer(600);
      setCanResend(false);
      // TODO: Show success toast
    } catch (error) {
      const errorMessage = getUserFriendlyError(error);
      setError('root', { message: errorMessage });
      shakeError();
    }
  };

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
      shakeError();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return 'bg-green-500';
    if (passwordStrength >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (passwordStrength >= 75) return 'Mạnh';
    if (passwordStrength >= 50) return 'Trung bình';
    if (passwordStrength > 0) return 'Yếu';
    return '';
  };

  return (
    <View className="w-full">
      {/* Timer Card */}
      <View className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons 
              name={timer > 0 ? "time" : "alert-circle"} 
              size={18} 
              color={timer <= 60 ? "#EF4444" : "#3B82F6"} 
              style={{ marginRight: 6 }} 
            />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {timer > 0 ? 'Hiệu lực:' : 'Hết hạn'}
              </Text>
              {timer > 0 && (
                <Animated.Text 
                  className={`text-xs ${timer <= 60 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} font-mono`}
                  style={{ transform: [{ scale: timer <= 60 ? pulseAnim : 1 }] }}
                >
                  {formatTime(timer)}
                </Animated.Text>
              )}
            </View>
          </View>
          {canResend && (
            <Pressable
              onPress={handleResendOTP}
              disabled={forgotPasswordMutation.isPending}
              className="bg-blue-600 px-3 py-1.5 rounded-lg active:opacity-70"
            >
              <Text className="text-white font-semibold text-xs">
                {forgotPasswordMutation.isPending ? 'Gửi...' : 'Gửi lại'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

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
            label="Mã xác thực"
            value={value}
            onChangeText={onChange}
            placeholder="000000"
            keyboardType="numeric"
            maxLength={6}
            error={errors.otpCode?.message}
            onFocus={() => setFocusedField('otpCode')}
            onBlur={() => setFocusedField(null)}
            iconLeft={<Ionicons name="shield-checkmark" size={20} color={AppColors.primary[500]} />}
          />
        )}
      />

      {/* New Password */}
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, value } }) => (
          <View>
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
            {/* Password Strength Indicator */}
            {value && (
              <View className="mb-3">
                <View className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View 
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </View>
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
      <View className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <View className="flex-row flex-wrap gap-2">
          {[
            { text: '8+ ký tự', check: newPassword?.length >= 8 },
            { text: 'Chữ hoa', check: /[A-Z]/.test(newPassword || '') },
            { text: 'Chữ thường', check: /[a-z]/.test(newPassword || '') },
            { text: 'Chữ số', check: /[0-9]/.test(newPassword || '') },
          ].map((req, index) => (
            <View key={index} className="flex-row items-center">
              <Ionicons 
                name={req.check ? "checkmark-circle" : "ellipse-outline"} 
                size={12} 
                color={req.check ? "#10B981" : "#9CA3AF"} 
                style={{ marginRight: 4 }}
              />
              <Text className={`text-xs ${req.check ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {req.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

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
        isLoading={resetPasswordMutation.isPending}
        disabled={resetPasswordMutation.isPending || timer === 0}
        className="mb-4"
      >
        <View className="flex-row items-center">
          {!resetPasswordMutation.isPending && (
            <Ionicons name="checkmark-circle" size={18} color="white" style={{ marginRight: 8 }} />
          )}
          <Text className="text-white font-semibold text-base">
            Đặt lại mật khẩu
          </Text>
        </View>
      </Button>

      {/* Back Button */}
      <Button
        variant="ghost"
        onPress={onBack}
        disabled={resetPasswordMutation.isPending}
      >
        <View className="flex-row items-center">
          <Ionicons name="arrow-back" size={18} color="#6B7280" style={{ marginRight: 8 }} />
          <Text className="text-gray-700 dark:text-gray-300 font-medium text-base">
            Quay lại
          </Text>
        </View>
      </Button>
    </View>
  );
}
