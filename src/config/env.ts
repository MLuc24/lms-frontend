const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENV || 'development';

// Validate API URL
if (!API_URL || API_URL === 'undefined') {
  console.error('❌ EXPO_PUBLIC_API_URL is not defined! Check your .env file.');
}

export const ENV = {
  API_URL,
  ENV: ENVIRONMENT,
} as const;
