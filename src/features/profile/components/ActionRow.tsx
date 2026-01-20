import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type ActionRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  rightText?: string;
  tone?: 'blue' | 'orange' | 'purple' | 'red' | 'gray';
  onPress?: () => void;
};

const toneMap = {
  blue: { 
    icon: '#3b82f6', 
    bg: ['#dbeafe', '#bfdbfe'] as [string, string],
    shadow: '#3b82f6'
  },
  orange: { 
    icon: '#f97316', 
    bg: ['#fed7aa', '#fdba74'] as [string, string],
    shadow: '#f97316'
  },
  purple: { 
    icon: '#a855f7', 
    bg: ['#f3e8ff', '#e9d5ff'] as [string, string],
    shadow: '#a855f7'
  },
  red: { 
    icon: '#ef4444', 
    bg: ['#fee2e2', '#fecaca'] as [string, string],
    shadow: '#ef4444'
  },
  gray: { 
    icon: '#64748b', 
    bg: ['#f1f5f9', '#e2e8f0'] as [string, string],
    shadow: '#64748b'
  },
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
      className="flex-row items-center justify-between rounded-3xl bg-white px-5 py-4 mb-3 active:scale-[0.98]"
      style={{
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center flex-1">
        {/* Icon with gradient background */}
        <LinearGradient
          colors={colors.bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name={icon} size={22} color={colors.icon} />
        </LinearGradient>
        
        <View className="ml-4 flex-1">
          <Text className="text-base font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'System' }}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-sm font-medium text-slate-500">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      
      <View className="flex-row items-center">
        {rightText ? (
          <Text className="mr-2 text-sm font-semibold text-slate-400">
            {rightText}
          </Text>
        ) : null}
        <View 
          className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>
      </View>
    </Pressable>
  );
}
