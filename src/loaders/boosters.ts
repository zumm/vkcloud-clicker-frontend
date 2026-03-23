import { defineColadaLoader } from 'vue-router/experimental/pinia-colada'
import { getActiveBoosters } from '@/api'

export const activeBoostersKey = ['me/active-boosters']

export const useActiveBoosters = defineColadaLoader({
  async query(_, { signal }) {
    const { items } = await getActiveBoosters({ signal })
    return items
  },
  key: activeBoostersKey,
  staleTime: 5 * 1000,
})
