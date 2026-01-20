import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  highlight?: boolean;
};

export function StatCard({ icon, value, label, highlight }: StatCardProps) {
  // Enhanced gradient colors based on type
  const getGradientColors = (): [string, string] => {
    if (icon === 'book') return ['#3b82f6', '#2563eb']; // Blue gradient for lessons
    if (icon === 'flame') return ['#f97316', '#ea580c']; // Orange gradient for streak
    if (icon === 'trophy') return ['#eab308', '#ca8a04']; // Yellow gradient for XP
    return ['#6366f1', '#4f46e5'];
  };

  const getIconBgGradient = (): [string, string] => {
    if (icon === 'book') return ['#dbeafe', '#bfdbfe']; // Light blue gradient
    if (icon === 'flame') return ['#fed7aa', '#fdba74']; // Light orange gradient
    if (icon === 'trophy') return ['#fef3c7', '#fde68a']; // Light yellow gradient
    return ['#e0e7ff', '#c7d2fe'];
  };

  const getShadowColor = () => {
    if (icon === 'book') return '#3b82f6';
    if (icon === 'flame') return '#f97316';
    if (icon === 'trophy') return '#eab308';
    return '#6366f1';
  };

  return (
    <View
      className={`flex-1 rounded-3xl overflow-hidden ${highlight ? 'bg-gradient-to-br from-orange-50 to-orange-100' : 'bg-white'
        }`}
      style={{
        aspectRatio: 1,
        shadowColor: highlight ? getShadowColor() : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: highlight ? 0.25 : 0.1,
        shadowRadius: highlight ? 12 : 8,
        elevation: highlight ? 8 : 4,
      }}
    >
      <View className="flex-1 items-center justify-center px-2">
        {/* Icon with gradient background */}
        <LinearGradient
          colors={getIconBgGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-10 w-10 items-center justify-center rounded-xl mb-1.5"
          style={{
            shadowColor: getShadowColor(),
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name={icon} size={18} color={getGradientColors()[0]} />
        </LinearGradient>

        {/* Value with gradient text effect */}
        <Text
          className="text-2xl font-black tracking-tight"
          style={{
            fontFamily: 'System',
            color: highlight ? getGradientColors()[0] : '#1e293b'
          }}
        >
          {value}
        </Text>

        {/* Label */}
        <Text className="mt-0.5 text-[9px] font-bold text-slate-500 tracking-wide uppercase">
          {label}
        </Text>
      </View>
    </View>
  );
}
