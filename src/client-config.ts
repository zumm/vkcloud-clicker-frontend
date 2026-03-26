import { client } from '@/api/client.gen'
import { getToken, refreshToken } from '@/auth'
import { API_BASE_URL } from '@/env'
import { ApiError } from '@/errors/api-error'
import { FetchError } from '@/errors/fetch-error'

// TODO: handle retries
// const retryStatusCodes = new Set([
//   408, // Request Timeout
//   409, // Conflict
//   425, // Too Early (Experimental)
//   429, // Too Many Requests
//   500, // Internal Server Error
//   502, // Bad Gateway
//   503, // Service Unavailable
//   504, // Gateway Timeout
// ])

export const configureClient = () => {
  client.setConfig({
    baseUrl: API_BASE_URL,
    auth: () => getToken() ?? '',
  })

  client.interceptors.error.use((error, response, request) => {
    if (!response) {
      return error
    }

    if (
      typeof error === 'object' && error
      && 'statusCode' in error && typeof error.statusCode === 'number'
      && 'message' in error && typeof error.message === 'string'
    ) {
      return new ApiError(error.message, request, response)
    }

    throw new FetchError(String(error), request, response)
  })

  // TODO: figure out better way to handle auth
  client.interceptors.response.use(async (response, request, options) => {
    if (response.status === 401 && !request.url.includes('signin')) {
      try {
        await refreshToken()
        request.headers.set('Authorization', `Bearer ${getToken()}`)

        const _fetch = options.fetch!
        response = await _fetch(request)!
      }
      catch {}
    }

    return response
  })
}
