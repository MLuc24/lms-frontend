import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import { cn } from '@/shared/utils/cn';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        // Base styles
        'rounded-lg items-center justify-center flex-row',
        // Width
        fullWidth && 'w-full',
        // Size variants
        size === 'sm' && 'px-3 py-2',
        size === 'md' && 'px-4 py-3',
        size === 'lg' && 'px-6 py-4',
        // Color variants
        variant === 'primary' && 'bg-primary-500 active:bg-primary-600',
        variant === 'secondary' && 'bg-gray-500 active:bg-gray-600',
        variant === 'outline' &&
          'border-2 border-primary-500 active:bg-primary-50 dark:active:bg-primary-900',
        variant === 'ghost' && 'active:bg-gray-100 dark:active:bg-gray-800',
        // Disabled state
        isDisabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#0ea5e9' : '#ffffff'}
          className="mr-2"
        />
      )}
      <Text
        className={cn(
          'font-semibold',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
          variant === 'primary' && 'text-white',
          variant === 'secondary' && 'text-white',
          variant === 'outline' && 'text-primary-500',
          variant === 'ghost' && 'text-gray-900 dark:text-white'
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
