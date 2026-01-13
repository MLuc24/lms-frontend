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

// Enhanced password strength calculation
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  return Math.min(strength, 4);
};

const getStrengthLabel = (strength: number): string => {
  if (strength <= 1) return 'Weak';
  if (strength === 2) return 'Fair';
  if (strength === 3) return 'Good';
  return 'Strong';
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 1) return '#EF4444';
  if (strength === 2) return '#F59E0B';
  if (strength === 3) return '#3B82F6';
  return '#10B981';
};

export function RegisterForm({ onSuccess, onLogin }: RegisterFormProps) {
  const registerMutation = useRegister();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      setError('root', { message: 'Please agree to the Terms & Conditions to continue' });
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

  const handleSocialSignup = (provider: string) => {
    // TODO: Implement social signup
    console.log(`Sign up with ${provider}`);
  };

  return (
    <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
      {/* Social Signup Buttons */}
      <View className="mb-6">
        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center mb-3">
          QUICK SIGN UP
        </Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => handleSocialSignup('google')}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 items-center justify-center active:scale-95"
            style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
          >
            <Ionicons name="logo-google" size={24} color="#EA4335" />
          </Pressable>
          <Pressable
            onPress={() => handleSocialSignup('apple')}
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 items-center justify-center active:scale-95"
            style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}
          >
            <Ionicons name="logo-apple" size={24} color="#000" />
          </Pressable>
          <Pressable
            onPress={() => handleSocialSignup('facebook')}
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
        <Text className="mx-4 text-xs font-medium text-gray-400 dark:text-gray-500">OR SIGN UP WITH EMAIL</Text>
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </View>

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input
              label="Email"
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
              placeholder="Create a strong password"
              secureTextEntry={true}
              showPasswordToggle={true}
              autoComplete="password"
              error={errors.password?.message}
              iconLeft={<MaterialIcons name="lock" size={20} color={focusedField === 'password' ? '#3B82F6' : AppColors.icon.password} />}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            {/* Enhanced Password Strength Indicator */}
            {value && value.length > 0 && (
              <View className="mb-4 -mt-2">
                <View className="flex-row gap-1.5 mb-2">
                  {[0, 1, 2, 3].map((index) => (
                    <View
                      key={index}
                      className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
                    >
                      {index < passwordStrength && (
                        <View 
                          className="h-full rounded-full"
                          style={{ backgroundColor: getStrengthColor(passwordStrength) }}
                        />
                      )}
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: getStrengthColor(passwordStrength) }}
                    />
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: getStrengthColor(passwordStrength) }}
                    >
                      {getStrengthLabel(passwordStrength)}
                    </Text>
                  </View>
                  {passwordStrength < 3 && (
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {passwordStrength < 2 ? 'Add uppercase & numbers' : 'Almost there!'}\n                    </Text>
                  )}
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
          <View className="mb-4">
            <Input
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              placeholder="Re-enter your password"
              secureTextEntry={true}
              showPasswordToggle={true}
              error={errors.confirmPassword?.message}
              iconLeft={<MaterialIcons name="lock-outline" size={20} color={focusedField === 'confirmPassword' ? '#3B82F6' : AppColors.icon.password} />}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}
      />

      {/* Terms & Conditions Checkbox - Enhanced */}
      <Pressable
        onPress={() => setAgreeToTerms(!agreeToTerms)}
        className="flex-row items-start mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl active:bg-gray-100 dark:active:bg-gray-800"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreeToTerms }}
      >
        <View
          className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center mt-0.5 ${
            agreeToTerms
              ? 'bg-blue-600 border-blue-600'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          {agreeToTerms && <Ionicons name="checkmark" size={14} color="#ffffff" />}
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
            I agree to the{' '}
            <Text className="text-blue-600 dark:text-blue-400 font-semibold">Terms & Conditions</Text>
            {' '}and{' '}
            <Text className="text-blue-600 dark:text-blue-400 font-semibold">Privacy Policy</Text>
          </Text>
        </View>
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

      {/* Create Account Button with Gradient */}
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={registerMutation.isPending}
        disabled={registerMutation.isPending || !agreeToTerms}
        className="mb-6"
        variant="gradient"
        size="lg"
      >
        <View className="flex-row items-center">
          {!registerMutation.isPending && (
            <Ionicons name="rocket-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text className="text-white font-bold text-base">
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </Text>
        </View>
      </Button>

      {/* Login Link */}
      <View className="flex-row justify-center items-center py-4">
        <Text className="text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{' '}
        </Text>
        <Pressable
          onPress={onLogin}
          accessibilityRole="button"
          accessibilityLabel="Login"
          className="active:opacity-70"
        >
          <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">
            Sign In
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
