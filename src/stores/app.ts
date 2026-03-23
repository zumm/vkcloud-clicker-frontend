import { useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isOnboardingSeen = useLocalStorage('isOnboardingSeen', false)
  const isFirstStepPopupSeen = useLocalStorage('isFirstStepPopupSeen', false)
  const isJackpotModalSeen = useLocalStorage('isJackpotModalSeen', false)

  const isPressed = shallowRef(false)
  const isLoading = shallowRef(false)

  let timerId: number | undefined
  const toggleLoading = (value: boolean, delayed = false) => {
    clearTimeout(timerId)

    if (delayed) {
      timerId = setTimeout(() => toggleLoading(value, false), 300)
      return
    }

    isLoading.value = value
  }

  const error = shallowRef<unknown>(null)

  return {
    isOnboardingSeen,
    isFirstStepPopupSeen,
    isJackpotModalSeen,
    isPressed,
    isLoading,
    toggleLoading,
    error,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
