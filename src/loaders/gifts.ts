import { defineColadaLoader } from 'vue-router/experimental/pinia-colada'
import { getEarnedGifts, getGifts, getJackpot } from '@/api'

export const giftsKey = ['gifts']

export const useGifts = defineColadaLoader({
  async query(_, { signal }) {
    const { items } = await getGifts({ signal })
    return items
  },
  key: giftsKey,
  staleTime: Infinity,
})

export const earnedGiftsKey = ['me/earned-gifts']

export const useEarnedGifts = defineColadaLoader({
  async query(_, { signal }) {
    const { items } = await getEarnedGifts({ signal })
    return items
  },
  key: earnedGiftsKey,
  staleTime: 5 * 1000,
})

export const jackpotKey = ['jackpot']

export const useJackpot = defineColadaLoader({
  async query() {
    return getJackpot()
  },
  key: jackpotKey,
  staleTime: Infinity,
})
