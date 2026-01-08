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
 * Reset Password Schema
 * Validates reset password form data (with OTP code)
 */
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    otpCode: z
      .string()
      .length(6, 'OTP code must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP code must contain only numbers'),
    newPassword: z
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
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
