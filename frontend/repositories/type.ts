export type ApiResponse<T> = Promise<{
  data: T
  message: string
  status: number
}>

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

export class AppError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.status = error.status;
    this.errors = error.errors;
    this.name = 'AppError';
  }
}

