<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

defineProps<{
  clickPower: number
}>()

const emit = defineEmits<{
  validClick: []
}>()

const { isPressed } = storeToRefs(useAppStore())

const onPressed = () => {
  isPressed.value = true
}

const onReleased = () => {
  if (!isPressed.value) {
    return
  }

  isPressed.value = false

  emit('validClick')
}

useEventListener('pointerleave', onReleased)
useEventListener('pointerup', onReleased)

// preventing default on click event is crucial to disable double tap zoom on ios

// using double image instead of morphing embedded svg to improve performance
// bcz svg has a filter changing fill color is slow
</script>

<template>
  <div
    class="relative flex w-fit cursor-pointer select-none"
    @pointerdown.prevent="onPressed"
    @click.prevent
  >
    <div
      class="pointer-events-none relative transition-[scale] duration-100"
      :class="{ 'scale-115': isPressed }"
    >
      <img src="@/assets/clicker-area.svg">

      <img
        class="absolute inset-0 transition-opacity duration-100"
        :class="{ 'opacity-0': !isPressed }"
        src="@/assets/clicker-area-pressed.svg"
      >
    </div>

    <p
      class="
        pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 text-sm
        font-medium text-primary duration-100
      "
    >
      ЖМИ

      <span
        v-if="clickPower > 1"
        class="
          absolute top-0 right-0 translate-x-2/3 -translate-y-full rounded-full
          bg-secondary px-1.5 py-0.5 text-[0.625rem]/none
        "
      >
        <span class="absolute inset-0 animate-ping rounded-full bg-secondary/75" />
        <span class="relative font-medium text-zinc-800">x{{ clickPower }}</span>
      </span>
    </p>
  </div>
</template>
