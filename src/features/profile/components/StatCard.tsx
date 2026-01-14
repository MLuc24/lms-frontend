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
    if (icon === 'book') return '#5b99ff'; // Blue for lessons
    if (icon === 'flame') return '#ff6b35'; // Orange for streak
    if (icon === 'trophy') return '#ffc107'; // Yellow for XP
    return '#3b82f6';
  };

  const getIconBgColor = () => {
    if (icon === 'book') return '#e3f2fd'; // Light blue for lessons
    if (icon === 'flame') return '#ffffff'; // White for streak (highlighted)
    if (icon === 'trophy') return '#fff9e6'; // Light yellow for XP
    return '#f5f5f5';
  };

  return (
    <View
      className={`flex-1 items-center rounded-2xl px-3 py-4 ${highlight ? 'bg-[#e3f2fd]' : 'bg-white'
        }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: getIconBgColor() }}
      >
        <Ionicons name={icon} size={20} color={getIconColor()} />
      </View>
      <Text className="mt-2 text-2xl font-extrabold text-[#1a1a1a]" style={{ fontFamily: 'System' }}>{value}</Text>
      <Text className="mt-0.5 text-xs font-normal text-[#8b8b8b]">{label}</Text>
    </View>
  );
}
