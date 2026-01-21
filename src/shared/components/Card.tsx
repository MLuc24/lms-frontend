import React from 'react';
import { View, Pressable, type PressableProps, type ViewProps } from 'react-native';
import { cn } from '@/shared/utils/cn';

interface CardProps extends ViewProps {
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Shadow variant */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Custom class */
  className?: string;
  children: React.ReactNode;
}

interface PressableCardProps extends Omit<PressableProps, 'children'> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export function Card({
  padding = 'md',
  shadow = 'sm',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl',
        paddingStyles[padding],
        shadowStyles[shadow],
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({
  padding = 'md',
  shadow = 'sm',
  className,
  children,
  ...props
}: PressableCardProps) {
  return (
    <Pressable
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl active:opacity-90',
        paddingStyles[padding],
        shadowStyles[shadow],
        className,
      )}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}
