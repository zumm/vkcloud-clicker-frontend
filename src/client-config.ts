import { promiseTimeout } from '@vueuse/core'
import isNetworkError from 'is-network-error'
import { client } from '@/api/client.gen'
import { getToken, refreshToken } from '@/auth'
import { API_BASE_URL } from '@/env'
import { ApiError } from '@/errors/api-error'
import { HttpError, isHttpError } from '@/errors/http-error'

const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early (Experimental)
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
])

const shouldRetry = (error: unknown) => {
  return (isHttpError(error) && retryStatusCodes.has(error.response.status)) || isNetworkError(error)
}

const handleRetry = async (error: unknown, retryCount: number) => {
  if (shouldRetry(error) && retryCount <= 1) {
    const delay = Math.min(500 * (2 ** retryCount), 20000)
    await promiseTimeout(delay)
    return true
  }

  return false
}

const handleAuth = async (request: Request, response?: Response) => {
  if (response?.status === 401 && !request.url.includes('signin')) {
    try {
      await refreshToken()
      request.headers.set('Authorization', `Bearer ${getToken()}`)
      return true
    }
    catch {}
  }

  return false
}

const createHttpError = async (request: Request, response: Response) => {
  try {
    const json = await response.clone().json()

    if (
      'statusCode' in json && typeof json.statusCode === 'number'
      && 'message' in json && typeof json.message === 'string'
    ) {
      return new ApiError(json.message, request, response)
    }
  }
  catch {}

  return new HttpError(response.statusText || `${response.status}`, request, response)
}

const hookedFetch = async (request: Request): Promise<Response> => {
  let retryCount = 0
  let response

  while (true) {
    retryCount += 1

    try {
      response = await fetch(request)

      if (!response.ok) {
        throw await createHttpError(request, response)
      }

      return response
    }
    catch (error) {
      if (await handleRetry(error, retryCount)) {
        continue
      }

      if (await handleAuth(request, response)) {
        retryCount = 0
        continue
      }

      throw error
    }
  }
}

export const configureClient = () => {
  client.setConfig({
    baseUrl: API_BASE_URL,
    auth: async () => {
      const token = getToken()
      if (token) {
        return token
      }

      // attempt to refresh token before request
      // instead of relying on handleAuth
      // to prevent mass request failures when app first loads
      // TODO: handle expired token similarly
      try {
        await refreshToken()
      }
      catch {
        // delegate token handling to handleAuth
      }

      return getToken() ?? ''
    },
    // @ts-expect-error client passes only request to fetch
    fetch: hookedFetch,
  })
}
