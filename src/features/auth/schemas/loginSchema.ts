import { z } from 'zod';

/**
 * Login Schema
 * Validates login form data
 * Backend requirement: At least one of email or phone must be provided
 */
export const loginSchema = z
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
      .min(1, 'Password is required')
      .max(50, 'Password too long'),
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
      path: ['email'], // Show error on email field
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
