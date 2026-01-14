import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  highlight?: boolean;
};

export function StatCard({ icon, value, label, highlight }: StatCardProps) {
  // Icon colors based on type
  const getIconColor = () => {
    if (icon === 'book') return '#3b82f6'; // Blue for lessons
    if (icon === 'flame') return '#f97316'; // Orange for streak
    if (icon === 'trophy') return '#eab308'; // Yellow for XP
    return '#2563eb';
  };

  const iconBgColor = highlight 
    ? 'bg-orange-100' 
    : icon === 'book' 
      ? 'bg-blue-50' 
      : icon === 'trophy'
        ? 'bg-yellow-50'
        : 'bg-slate-50';

  return (
    <View
      className={`flex-1 items-center rounded-3xl px-3 py-5 ${
        highlight ? 'bg-blue-50 border border-blue-100' : 'bg-white shadow-sm'
      }`}
    >
      <View
        className={`h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}
      >
        <Ionicons name={icon} size={24} color={getIconColor()} />
      </View>
      <Text className="mt-3 text-3xl font-bold text-slate-900">{value}</Text>
      <Text className="mt-1 text-sm font-medium text-slate-500">{label}</Text>
    </View>
  );
}
