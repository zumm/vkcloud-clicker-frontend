import { useMiniApp } from 'vue-tg'
import { signIn } from '@/api'
import { DEFAULT_INIT_DATA } from '@/env'

const TOKEN_KEY = 'accessToken'

export const setToken = (token: string | null) => {
  if (token === null) {
    localStorage.removeItemItem(TOKEN_KEY)
  }
  else {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

const refreshToken = async () => {
  let initData

  try {
    initData = useMiniApp().initData
  }
  catch {}

  if (!initData) {
    initData = DEFAULT_INIT_DATA ?? ''
  }

  const data = await signIn({
    body: {
      initData,
    },
  })

  setToken(data.token)
}

let promise: Promise<unknown> | undefined
const serialRefreshToken = async () => {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (promise) {
    try {
      return await promise
    }
    catch {}
  }

  promise = refreshToken().finally(() => promise = undefined)
  return promise
}

export { serialRefreshToken as refreshToken }
