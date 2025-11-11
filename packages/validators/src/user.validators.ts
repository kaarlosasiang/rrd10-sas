import { z } from 'zod';

// Common validators
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters');

// User schemas
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: emailSchema.optional(),
});

// Example: ID validation
export const idSchema = z.string().uuid('Invalid ID format');

// Export types inferred from schemas
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

