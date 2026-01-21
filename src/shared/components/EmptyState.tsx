import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/shared/utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  /** Icon component */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button config */
  action?: {
    label: string;
    onPress: () => void;
  };
  /** Custom class */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <View
      className={cn(
        'flex-1 items-center justify-center px-8 py-12',
        className,
      )}
    >
      {icon && (
        <View className="mb-4 opacity-50">
          {icon}
        </View>
      )}
      <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {description}
        </Text>
      )}
      {action && (
        <Button
          variant="primary"
          size="md"
          onPress={action.onPress}
          fullWidth={false}
        >
          <Text className="text-white font-medium">{action.label}</Text>
        </Button>
      )}
    </View>
  );
}
