import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ActionRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  rightText?: string;
  tone?: 'blue' | 'orange' | 'purple' | 'red' | 'gray';
  onPress?: () => void;
};

const toneMap = {
  blue: { icon: '#3b82f6', bg: '#dbeafe' },
  orange: { icon: '#f97316', bg: '#fed7aa' },
  purple: { icon: '#a855f7', bg: '#e9d5ff' },
  red: { icon: '#ef4444', bg: '#fecaca' },
  gray: { icon: '#64748b', bg: '#f1f5f9' },
};

const getIconTone = (icon: keyof typeof Ionicons.glyphMap): 'blue' | 'orange' | 'purple' | 'red' | 'gray' => {
  if (icon === 'stats-chart') return 'blue';
  if (icon === 'flame') return 'orange';
  if (icon === 'notifications') return 'blue';
  if (icon === 'alarm') return 'purple';
  if (icon === 'settings') return 'blue';
  if (icon === 'shield-checkmark') return 'purple';
  if (icon === 'help-circle') return 'blue';
  return 'gray';
};

export function ActionRow({
  icon,
  title,
  subtitle,
  rightText,
  tone,
  onPress,
}: ActionRowProps) {
  const iconTone = tone || getIconTone(icon);
  const colors = toneMap[iconTone];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm active:opacity-80"
    >
      <View className="flex-row items-center flex-1">
        <View 
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.bg }}
        >
          <Ionicons name={icon} size={24} color={colors.icon} />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-base font-bold text-slate-900">{title}</Text>
          {subtitle ? (
            <Text className="mt-1 text-sm font-medium text-slate-500">{subtitle}</Text>
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
