export class HttpError extends Error {
  override name = 'FetchError'

  constructor(
    message: string,
    readonly request: Request,
    readonly response: Response,
  ) {
    super(message)
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError
}
