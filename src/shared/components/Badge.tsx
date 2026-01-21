import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/shared/utils/cn';

interface BadgeProps {
  /** Badge text */
  children: React.ReactNode;
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Size */
  size?: 'sm' | 'md';
  /** Custom class */
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 dark:bg-gray-700',
  primary: 'bg-blue-100 dark:bg-blue-900/30',
  success: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  error: 'bg-red-100 dark:bg-red-900/30',
  info: 'bg-cyan-100 dark:bg-cyan-900/30',
};

const textVariantStyles = {
  default: 'text-gray-700 dark:text-gray-300',
  primary: 'text-blue-700 dark:text-blue-300',
  success: 'text-green-700 dark:text-green-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
  error: 'text-red-700 dark:text-red-300',
  info: 'text-cyan-700 dark:text-cyan-300',
};

const sizeStyles = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
};

const textSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <View
      className={cn(
        'rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      <Text
        className={cn(
          'font-medium',
          textVariantStyles[variant],
          textSizeStyles[size],
        )}
      >
        {children}
      </Text>
    </View>
  );
}
