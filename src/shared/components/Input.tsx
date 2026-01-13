import React, { useState } from 'react';
import { TextInput, View, Text, Pressable, type TextInputProps } from 'react-native';
import { cn } from '@/shared/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/config/colors';

interface InputProps extends Omit<TextInputProps, 'editable'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?:
    | 'email'
    | 'password'
    | 'name'
    | 'tel'
    | 'username'
    | 'off';
  editable?: boolean;
  showPasswordToggle?: boolean;
  iconLeft?: React.ReactNode;
  iconLeftColor?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  editable = true,
  showPasswordToggle = false,
  iconLeft,
  iconLeftColor,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = secureTextEntry || showPasswordToggle;
  const actuallySecure = isPassword && !isPasswordVisible;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <View className="mb-4">
      <Text 
        className={cn(
          "text-sm font-semibold mb-2 transition-colors",
          isFocused ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300",
          error && "text-red-600 dark:text-red-400"
        )}
      >
        {label}
      </Text>
      <View className="relative">
        {iconLeft && (
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            {iconLeft}
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={actuallySecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'w-full py-3.5 rounded-xl bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white text-base',
            'transition-all duration-200',
            iconLeft ? 'pl-12 pr-4' : 'px-4',
            isPassword && showPasswordToggle ? 'pr-12' : '',
            // Border styles
            error
              ? 'border-2 border-red-500'
              : isFocused
              ? 'border-2 border-blue-500'
              : 'border-2 border-gray-200 dark:border-gray-700',
            !editable && 'opacity-50 bg-gray-100 dark:bg-gray-800',
            // Shadow
            isFocused && !error && 'shadow-lg shadow-blue-500/20'
          )}
          style={{
            fontSize: 16,
          }}
          {...props}
        />
        {isPassword && showPasswordToggle && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-0 bottom-0 justify-center active:opacity-70"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={22}
              color={isFocused ? '#3B82F6' : AppColors.text.secondary}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <View className="flex-row items-center mt-1.5">
          <Ionicons name="alert-circle" size={14} color="#EF4444" style={{ marginRight: 4 }} />
          <Text className="text-sm text-red-500 flex-1">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
