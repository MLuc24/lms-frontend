import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function ScreenHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
}: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
      {onBack ? (
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
      ) : (
        <View className="h-10 w-10" />
      )}
      <Text className="text-lg font-semibold text-slate-900">{title}</Text>
      <Pressable
        onPress={onRightPress}
        className="h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        {rightIcon ? (
          <Ionicons name={rightIcon} size={20} color="#0f172a" />
        ) : (
          <View className="h-4 w-4" />
        )}
      </Pressable>
    </View>
  );
}
