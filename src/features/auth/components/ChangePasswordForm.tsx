import React from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useChangePassword } from '../hooks/useChangePassword';
import { changePasswordSchema, type ChangePasswordFormData } from '../schemas';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const changePasswordMutation = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  return (
    <View className="w-full">
      {/* Current Password */}
      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Current Password"
            value={value}
            onChangeText={onChange}
            placeholder="Enter current password"
            secureTextEntry={true}
            showPasswordToggle={true}
            autoComplete="password"
            error={errors.currentPassword?.message}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
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

      {/* Confirm New Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Confirm New Password"
            value={value}
            onChangeText={onChange}
            placeholder="Re-enter new password"
            secureTextEntry={true}
            showPasswordToggle={true}
            error={errors.confirmPassword?.message}
            iconLeft={<MaterialIcons name="lock" size={20} color={AppColors.icon.password} />}
          />
        )}
      />

      {/* Password Requirements */}
      <View className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <Text className="mb-1 text-xs text-gray-600 dark:text-gray-400">
          New password must contain:
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          - At least 8 characters
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          - One uppercase letter
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          - One lowercase letter
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          - One number
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          - Different from current password
        </Text>
      </View>

      {/* Error Message */}
      {errors.root && (
        <Text className="text-sm text-red-500 mb-4 text-center">
          {errors.root.message}
        </Text>
      )}

      {/* Buttons */}
      <View className="gap-3">
        <Button
          onPress={handleSubmit(onSubmit)}
          isLoading={changePasswordMutation.isPending}
          disabled={changePasswordMutation.isPending}
        >
          Change Password
        </Button>

        {onCancel && (
          <Button
            variant="outline"
            onPress={onCancel}
            disabled={changePasswordMutation.isPending}
          >
            Cancel
          </Button>
        )}
      </View>
    </View>
  );
}
