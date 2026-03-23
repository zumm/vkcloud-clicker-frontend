import { defineColadaLoader } from 'vue-router/experimental/pinia-colada'
import { getUser } from '@/api'

export const userDataKey = ['me']

export const useUserData = defineColadaLoader({
  async query(_, { signal }) {
    return getUser({ signal })
  },
  key: userDataKey,
  staleTime: 5 * 1000,
})
