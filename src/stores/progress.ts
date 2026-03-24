import { clamp } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import { getLast } from '@/helpers/get-last'
import { useEarnedGifts, useGifts } from '@/loaders/gifts'
import { useUserData } from '@/loaders/user-data'
import { useClickSessionsStore } from '@/stores/click-sessions'

export const useProgressStore = defineStore('progress', () => {
  const clickSession = useClickSessionsStore()
  const { data: userData } = useUserData()
  const balance = computed(() => userData.value.balance + clickSession.totalValue)

  const { data: gifts } = useGifts()
  const { data: earnedGifts } = useEarnedGifts()

  const lastGift = computed(() => getLast(gifts.value))
  const previousGift = computed(() => gifts.value[earnedGifts.value.length - 1])
  const nextGift = computed(() => gifts.value[earnedGifts.value.length])

  const totalProgress = computed(() => clamp(balance.value / (lastGift.value?.target || 1), 0, 1))

  const giftProgress = computed(() => {
    const previousTarget = previousGift.value?.target ?? 0
    const nextTarget = nextGift.value?.target ?? previousTarget
    const target = nextTarget - previousTarget

    if (target <= 0) {
      return 1
    }

    return clamp((balance.value - previousTarget) / target, 0, 1)
  })

  return {
    balance,
    lastGift,
    previousGift,
    nextGift,
    totalProgress,
    giftProgress,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgressStore, import.meta.hot))
}
