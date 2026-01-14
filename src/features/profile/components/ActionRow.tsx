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
  blue: { icon: '#5b99ff', bg: '#e3f2fd' },
  orange: { icon: '#ff6b35', bg: '#ffe8e0' },
  purple: { icon: '#9c6bff', bg: '#f3e8ff' },
  red: { icon: '#ff5252', bg: '#ffe5e5' },
  gray: { icon: '#9e9e9e', bg: '#f5f5f5' },
};

const getIconTone = (icon: keyof typeof Ionicons.glyphMap): 'blue' | 'orange' | 'purple' | 'red' | 'gray' => {
  if (icon === 'stats-chart') return 'blue';
  if (icon === 'flame') return 'orange';
  if (icon === 'notifications') return 'orange';
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
      className="flex-row items-center justify-between rounded-2xl bg-white px-4 py-3.5 active:opacity-80"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.bg }}
        >
          <Ionicons name={icon} size={20} color={colors.icon} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-[#1a1a1a]" style={{ fontFamily: 'System' }}>{title}</Text>
          {subtitle ? (
            <Text className="mt-0.5 text-sm font-normal text-[#8b8b8b]">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row items-center">
        {rightText ? (
          <Text className="mr-2 text-sm font-normal text-[#8b8b8b]">
            {rightText}
          </Text>
        ) : null}
        <Ionicons name="chevron-forward" size={20} color="#c0c0c0" />
      </View>
    </Pressable>
  );
}
