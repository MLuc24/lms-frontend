import { z } from 'zod';

/**
 * Password validation regex
 * Must contain at least:
 * - 1 uppercase letter
 * - 1 lowercase letter
 * - 1 number
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

/**
 * Register Schema
 * Validates registration form data
 * Backend requirement: At least one of email or phone must be provided
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email format')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .max(50, 'Phone number too long')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password too long')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    displayName: z
      .string()
      .min(1, 'Display name is required')
      .max(255, 'Display name too long'),
  })
  .refine(
    (data) => {
      // At least one of email or phone must be provided
      const hasEmail = data.email && data.email.trim() !== '';
      const hasPhone = data.phone && data.phone.trim() !== '';
      return hasEmail || hasPhone;
    },
    {
      message: 'Either email or phone is required',
      path: ['email'],
    }
  )
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;
