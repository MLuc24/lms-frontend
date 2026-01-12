// Color constants for the app
export const AppColors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Icon colors
  icon: {
    email: '#3b82f6', // blue-500
    password: '#6366f1', // indigo-500
    user: '#8b5cf6', // violet-500
    mascot: '#3b82f6', // blue-500
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
  
  // Error colors
  error: {
    500: '#ef4444',
    600: '#dc2626',
  },
  
  // Success colors
  success: {
    500: '#10b981',
    600: '#059669',
  },
} as const;
