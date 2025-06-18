export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    }
  }

  // Handle Supabase errors
  if (error instanceof Error) {
    return {
      error: {
        message: error.message,
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    }
  }

  // Handle unknown errors
  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    },
  }
} 