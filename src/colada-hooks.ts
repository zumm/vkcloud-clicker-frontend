import { PiniaColadaQueryHooksPlugin } from '@pinia/colada'
import { useAppStore } from '@/stores/app'

export default PiniaColadaQueryHooksPlugin({
  onError(error) {
    const appStore = useAppStore()
    appStore.error = error
  },
})
