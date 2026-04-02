import { HttpError } from '@/errors/http-error'

export class ApiError extends HttpError {
  override name = 'ApiError'
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
