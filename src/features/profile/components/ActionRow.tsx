import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ActionRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  rightText?: string;
  tone?: 'blue' | 'orange' | 'gray';
  onPress?: () => void;
};

const toneMap = {
  blue: '#2563eb',
  orange: '#f97316',
  gray: '#64748b',
};

export function ActionRow({
  icon,
  title,
  subtitle,
  rightText,
  tone = 'blue',
  onPress,
}: ActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm"
    >
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#eef5ff]">
          <Ionicons name={icon} size={22} color={toneMap[tone]} />
        </View>
        <View className="ml-4">
          <Text className="text-base font-semibold text-slate-900">{title}</Text>
          {subtitle ? (
            <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row items-center">
        {rightText ? (
          <Text className="mr-2 text-sm font-medium text-slate-500">
            {rightText}
          </Text>
        ) : null}
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </View>
    </Pressable>
  );
}
