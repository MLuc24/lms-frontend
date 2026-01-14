import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  highlight?: boolean;
};

export function StatCard({ icon, value, label, highlight }: StatCardProps) {
  return (
    <View
      className={`flex-1 items-center rounded-3xl px-4 py-5 ${
        highlight ? 'bg-[#eef5ff] border border-[#d7e7ff]' : 'bg-white'
      }`}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${
          highlight ? 'bg-[#dbeafe]' : 'bg-[#f1f5f9]'
        }`}
      >
        <Ionicons name={icon} size={22} color="#2563eb" />
      </View>
      <Text className="mt-3 text-2xl font-semibold text-slate-900">{value}</Text>
      <Text className="mt-1 text-sm font-medium text-slate-500">{label}</Text>
    </View>
  );
}
