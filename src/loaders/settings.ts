import { defineColadaLoader } from 'vue-router/experimental/pinia-colada'
import { getSettings } from '@/api'

export const settingsKey = ['settings']

export const useSettings = defineColadaLoader({
  async query(_, { signal }) {
    return getSettings({ signal })
  },
  key: settingsKey,
  staleTime: 30 * 1000,
})
