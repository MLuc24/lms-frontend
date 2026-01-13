import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps, View } from 'react-native';
import { cn } from '@/shared/utils/cn';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  isLoading,
  fullWidth = true,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseStyles = cn(
    // Base styles
    'rounded-xl items-center justify-center flex-row overflow-hidden',
    // Width
    fullWidth && 'w-full',
    // Size variants
    size === 'sm' && 'px-4 py-2.5',
    size === 'md' && 'px-5 py-3',
    size === 'lg' && 'px-6 py-4',
    // Disabled state
    isDisabled && 'opacity-60',
    className
  );

  // Gradient variant renders differently
  if (variant === 'gradient') {
    return (
      <Pressable
        disabled={isDisabled}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
          },
        ]}
        {...props}
      >
        <LinearGradient
          colors={['#3B82F6', '#2563EB', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              borderRadius: 12,
              paddingHorizontal: size === 'sm' ? 16 : size === 'md' ? 20 : 24,
              paddingVertical: size === 'sm' ? 10 : size === 'md' ? 12 : 16,
              opacity: isDisabled ? 0.6 : 1,
            },
          ]}
          className={cn('flex-row items-center justify-center', fullWidth && 'w-full')}
        >
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
          )}
          {children}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        baseStyles,
        // Color variants
        variant === 'primary' && 'bg-blue-600 active:bg-blue-700',
        variant === 'secondary' && 'bg-gray-600 active:bg-gray-700',
        variant === 'outline' &&
          'border-2 border-blue-600 bg-transparent active:bg-blue-50 dark:active:bg-blue-900/20',
        variant === 'ghost' && 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800'
      )}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
        },
      ]}
      {...props}
    >
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' ? '#3B82F6' : '#ffffff'
          }
          className="mr-2"
        />
      )}
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'font-bold',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-base',
            variant === 'primary' && 'text-white',
            variant === 'secondary' && 'text-white',
            variant === 'outline' && 'text-blue-600 dark:text-blue-400',
            variant === 'ghost' && 'text-gray-900 dark:text-white'
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
