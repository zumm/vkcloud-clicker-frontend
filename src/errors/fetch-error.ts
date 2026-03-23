export class FetchError extends Error {
  override name = 'FetchError'

  constructor(
    message: string,
    readonly request: Request,
    readonly response: Response,
  ) {
    super(message)
  }
}

export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError
}
