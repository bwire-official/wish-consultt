import { z } from 'zod'
import { AppError } from './error-handling'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  )

// User validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  invited_by: z.string().optional(),
})

// Course validation schemas
export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export const segmentSchema = z.object({
  course_id: z.string().uuid('Invalid course ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  video_url: z.string().url('Invalid video URL').optional(),
  pdf_url: z.string().url('Invalid PDF URL').optional(),
  segment_order: z.number().int().min(0),
})

// Validation helper function
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        error.errors.map((e) => e.message).join(', '),
        400,
        'VALIDATION_ERROR'
      )
    }
    throw error
  }
} 