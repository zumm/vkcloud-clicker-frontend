import { FetchError } from '@/errors/fetch-error'

export class ApiError extends FetchError {
  override name = 'ApiError'
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
