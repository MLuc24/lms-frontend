const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENV || 'development';

// Debug: Log API URL on app start
if (__DEV__) {
  console.log('🔧 ENV Config:', {
    API_URL,
    ENV: ENVIRONMENT,
  });
}

export const ENV = {
  API_URL,
  ENV: ENVIRONMENT,
} as const;
