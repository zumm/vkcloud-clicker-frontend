import type { MeDtoOutput } from '@/api'
import { useQueryCache } from '@pinia/colada'
import { createSharedComposable, promiseTimeout, tryOnScopeDispose, until, useNetwork } from '@vueuse/core'
import { shallowRef } from 'vue'
import { submitClickSession } from '@/api'
import { isApiError } from '@/errors/api-error'
import { activeBoostersKey } from '@/loaders/boosters'
import { userDataKey } from '@/loaders/user-data'
import { useClickSessionsStore } from '@/stores/click-sessions'

export const useClickSessionsUploader = createSharedComposable(() => {
  const clickSessionsStore = useClickSessionsStore()
  const { isSupported, isOnline } = useNetwork()
  const queryCache = useQueryCache()

  let delay = 200
  let isUploading = false // just to be safe
  const uploadNext = async () => {
    if (isUploading) {
      return
    }

    isUploading = true

    try {
      await until(() => clickSessionsStore.sealed.length).toBeTruthy()
      await until(() => !isSupported.value || isOnline.value).toBeTruthy()

      const session = clickSessionsStore.sealed[0]
      if (!session) {
        return
      }

      const { balance, reward, isMilestoneReached } = await submitClickSession({
        // @ts-expect-error we will discard it on invalid input anyway
        body: session,
      })

      if (session.estimatedValue !== reward) {
        console.warn('Balance diff', session.estimatedValue, reward)
      }

      clickSessionsStore.sealed.shift()

      const data = queryCache.getQueryData<MeDtoOutput>(userDataKey)
      if (data && balance > data.balance) {
        data.balance = balance
        queryCache.setQueryData<MeDtoOutput>(userDataKey, data)
      }

      if (isMilestoneReached) {
        clickSessionsStore.flush()
        queryCache.invalidateQueries({ key: activeBoostersKey }, true)
      }

      delay = 200
    }
    catch (error) {
      console.error(error)

      if (isApiError(error) && error.response.status === 400) {
        clickSessionsStore.sealed.shift()
      }
      else {
        await promiseTimeout(delay)
        delay = Math.min(delay * 2, 20000)
      }
    }
    finally {
      isUploading = false
    }
  }

  const isActive = shallowRef(true)
  const loop = async () => {
    if (isActive) {
      await uploadNext()
      loop()
    }
  }

  const pause = () => {
    isActive.value = false
  }

  const resume = () => {
    isActive.value = true
    loop()
  }

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
})
