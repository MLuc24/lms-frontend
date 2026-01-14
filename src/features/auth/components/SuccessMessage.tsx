import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/shared/components/Button';

interface SuccessMessageProps {
  title: string;
  message: string;
  onContinue?: () => void;
}

export function SuccessMessage({ title, message, onContinue }: SuccessMessageProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate circle scale
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Animate checkmark with delay
    setTimeout(() => {
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 200);
  }, []);

  return (
    <View className="items-center py-4">
      {/* Animated Success Icon */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-6">
          <Animated.View
            style={{
              transform: [{ scale: checkAnim }],
            }}
          >
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
        {title}
      </Text>

      {/* Message */}
      <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8 px-4">
        {message}
      </Text>

      {/* Progress Indicator */}
      <View className="w-full mb-6">
        <View className="flex-row items-center justify-center mb-2">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            Tự động chuyển hướng sau 3 giây...
          </Text>
        </View>
        <View className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-green-500"
            style={{
              width: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </View>
      </View>

      {/* Continue Button */}
      {onContinue && (
        <Button
          variant="gradient"
          onPress={onContinue}
          className="w-full"
        >
          <Text className="text-white font-semibold text-base">
            Đăng nhập ngay
          </Text>
        </Button>
      )}
    </View>
  );
}
