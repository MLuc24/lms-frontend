import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Icon component types for reusability
export const AppIcons = {
  // Auth icons
  email: { component: MaterialIcons, name: 'email' },
  password: { component: MaterialIcons, name: 'lock' },
  eyeOpen: { component: Ionicons, name: 'eye' },
  eyeClosed: { component: Ionicons, name: 'eye-off' },
  user: { component: Ionicons, name: 'person' },
  
  // Mascot
  mascot: { component: Ionicons, name: 'school' },
} as const;

export type IconName = keyof typeof AppIcons;
