<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const reset = () => {
  appStore.isOnboardingSeen = false
  appStore.isJackpotModalSeen = false
}
</script>

<template>
  <div
    class="cursor-pointer bg-white px-2 py-1 font-mono"
    @click="reset"
  >
    Reset
  </div>
</template>
