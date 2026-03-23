<script setup lang="ts">
import { onErrorCaptured, onMounted } from 'vue'
import { ModalsContainer } from 'vue-final-modal'
import { RouterView, useRouter } from 'vue-router'
import FpsCounter from '@/components/FpsCounter.vue'
import JackpotModal from '@/components/JackpotModal.vue'
import ResetLocalStorage from '@/components/ResetLocalStorage.vue'
import CriticalErrorScreen from '@/components/screens/CriticalErrorScreen.vue'
import LoadingScreen from '@/components/screens/LoadingScreen.vue'
import { useClickSessionsUploader } from '@/composables/click-session-uploader'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

router.beforeEach((_, from) => {
  appStore.toggleLoading(true, !!from.name)
})

router.afterEach(() => {
  appStore.toggleLoading(false)
})

router.onError((error) => {
  console.error(error)

  appStore.error = error
})

onErrorCaptured((error) => {
  console.error(error)

  appStore.error = error
  return false
})

// todo: find better place
const { resume } = useClickSessionsUploader()
onMounted(() => resume())
</script>

<template>
  <ResetLocalStorage class="fixed top-0 left-0 z-999" />
  <FpsCounter class="fixed top-0 right-0 z-999" />

  <JackpotModal />

  <template v-if="appStore.error == null">
    <LoadingScreen v-if="appStore.isLoading" />
    <RouterView v-else />
  </template>
  <CriticalErrorScreen
    v-else
    :error="appStore.error"
  />

  <ModalsContainer />
</template>
