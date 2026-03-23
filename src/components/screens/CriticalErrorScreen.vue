<script setup lang="ts">
import Button from '@/components/kit/Button.vue'
import Screen from '@/components/kit/Screen.vue'

defineProps<{
  error?: unknown
}>()

const hardReset = () => {
  globalThis.location.reload()
}
</script>

<template>
  <Screen class="items-center justify-center">
    <h1 class="text-xl text-neutral-100">
      Упс, что-то пошло не так...
    </h1>

    <p
      v-if="error"
      class="text-neutral-300"
    >
      {{ error }}
    </p>

    <Button
      class="mt-8"
      @click="hardReset"
    >
      Перезагрузить
    </Button>
  </Screen>
</template>
