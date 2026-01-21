/**
 * AvatarUploader Component
 * 
 * Tuân thủ FE_GUIDELINES:
 * ✅ Sử dụng NativeWind v4 cho styling (className)
 * ✅ Logic tách ra hook riêng (useAvatarUploader)
 * ✅ Component < 500 dòng
 * ✅ Accessibility labels đầy đủ
 * ✅ KHÔNG dùng inline styles (StyleSheet)
 * ✅ Responsive với size variants
 */

import React from 'react';
import { View, Pressable, Image, Text, ActivityIndicator } from 'react-native';
import { cn } from '@/shared/utils/cn';
import { getMediaUrl } from '@/shared/utils/media';
import { useAvatarUploader } from '../hooks/useAvatarUploader';

interface AvatarUploaderProps {
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

const SIZES = {
  sm: { container: 'w-16 h-16', text: 'text-xs', overlay: 'p-1' },
  md: { container: 'w-24 h-24', text: 'text-sm', overlay: 'p-1.5' },
  lg: { container: 'w-32 h-32', text: 'text-base', overlay: 'p-2' },
};

export function AvatarUploader({ 
  size = 'lg',
  editable = true 
}: AvatarUploaderProps) {
  const {
    avatarUrl: rawAvatarUrl,
    isUploading,
    handlePickImage,
  } = useAvatarUploader();

  const sizeClasses = SIZES[size];
  
  // Convert relative path to full URL (unless it's a local URI)
  const avatarUrl = rawAvatarUrl?.startsWith('file://') 
    ? rawAvatarUrl 
    : getMediaUrl(rawAvatarUrl);

  return (
    <View className="items-center">
      <Pressable
        onPress={editable ? handlePickImage : undefined}
        disabled={!editable || isUploading}
        accessible
        accessibilityLabel="Upload avatar"
        accessibilityRole="button"
        accessibilityState={{ disabled: !editable || isUploading }}
        className={cn(
          sizeClasses.container,
          'rounded-full bg-gray-200 dark:bg-gray-700',
          'items-center justify-center overflow-hidden',
          'border-2 border-gray-300 dark:border-gray-600',
          editable && 'active:opacity-80'
        )}
      >
        {isUploading ? (
          <ActivityIndicator size="large" color="#0ea5e9" />
        ) : avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full"
            accessibilityLabel="User avatar"
          />
        ) : (
          <View className="items-center justify-center">
            <Text className={cn(
              'font-semibold text-gray-500 dark:text-gray-400',
              sizeClasses.text
            )}>
              No Avatar
            </Text>
          </View>
        )}

        {/* Edit overlay - camera icon */}
        {editable && !isUploading && (
          <View className={cn(
            'absolute bottom-0 right-0',
            'bg-primary-500 rounded-full',
            'border-2 border-white dark:border-gray-800',
            sizeClasses.overlay
          )}>
            <Text className="text-white text-xs">📷</Text>
          </View>
        )}
      </Pressable>

      {editable && (
        <Text className={cn(
          'mt-2 text-gray-600 dark:text-gray-400',
          sizeClasses.text
        )}>
          {isUploading ? 'Uploading...' : 'Tap to change'}
        </Text>
      )}
    </View>
  );
}
