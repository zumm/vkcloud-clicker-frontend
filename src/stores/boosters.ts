import type { UserBoosterViewDto } from '@/api'
import { useQueryCache } from '@pinia/colada'
import { createEventHook, tryOnScopeDispose, useArrayFilter, useArrayReduce, useSorted } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { getLast } from '@/helpers/get-last'
import { activeBoostersKey, useActiveBoosters } from '@/loaders/boosters'
import { useClickSessionsStore } from '@/stores/click-sessions'

export const useBoostersStore = defineStore('boosters', () => {
  const { flush } = useClickSessionsStore()

  const { data: boosters } = useActiveBoosters()

  const sortedBoosters = useSorted(boosters, (a, b) => {
    // Infinity - Infinity case prevention
    if (a === b) {
      return 0
    }

    return (a.expiresAt?.valueOf() ?? Infinity) - (b.expiresAt?.valueOf() ?? Infinity)
  })

  const temporatyBoosters = useArrayFilter(sortedBoosters, booster => booster.expiresAt != null)

  const shortestBooster = computed(() => temporatyBoosters.value[0])
  const longestBooster = computed(() => getLast(temporatyBoosters.value))

  const queryCache = useQueryCache()

  let timerId: number | undefined
  watch(shortestBooster, (booster) => {
    clearTimeout(timerId)
    timerId = undefined

    if (!booster || !booster.expiresAt) {
      return
    }

    // we want to flush click session a moment before booster expires
    // it increases the chances of backend applaying booster to the session
    const delay = booster.expiresAt.valueOf() - Date.now() - 100

    timerId = setTimeout(() => {
      flush()

      let data = queryCache.getQueryData<UserBoosterViewDto[]>(activeBoostersKey)
      if (data) {
        data = data.filter(({ userBoosterId }) => booster.userBoosterId !== userBoosterId)
        queryCache.setQueryData<UserBoosterViewDto[]>(activeBoostersKey, data)
      }
    }, delay)
  })

  tryOnScopeDispose(() => clearTimeout(timerId))

  const boostersSummary = useArrayReduce(
    boosters,
    (summary, booster) => {
      summary[booster.type] += booster.value
      return summary
    },
    () => ({
      CLICK_ADDITIVE: 0,
      CLICK_MULTIPLIER: 1,
    }),
  )

  const clickPower = computed(() => {
    const { CLICK_ADDITIVE, CLICK_MULTIPLIER } = boostersSummary.value
    return (1 + CLICK_ADDITIVE) * CLICK_MULTIPLIER
  })

  const newBoosterHook = createEventHook<UserBoosterViewDto>()
  let lastBoosterActivatedAt = Math.max(...boosters.value.map(({ activatedAt }) => activatedAt?.valueOf() ?? 0))
  watch(boosters, (boosters) => {
    const newBoosters = boosters.filter(({ activatedAt }) => (activatedAt?.valueOf() ?? 0) > lastBoosterActivatedAt)

    for (const booster of newBoosters) {
      newBoosterHook.trigger(booster)
      lastBoosterActivatedAt = Math.max(lastBoosterActivatedAt, booster.activatedAt?.valueOf() ?? 0)
    }

    if (newBoosters.length > 0) {
      flush()
    }
  })

  return {
    sortedBoosters,
    shortestBooster,
    longestBooster,
    boostersSummary,
    clickPower,
    onNewBooster: newBoosterHook.on,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoostersStore, import.meta.hot))
}
