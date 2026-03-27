<script setup lang="ts">
import type { MotionValue } from 'motion-v'
import { clamp } from '@vueuse/core'
import { isMotionValue, Motion, motionValue, useComputed } from 'motion-v'
import { computed } from 'vue'

const props = defineProps<{
  progress: number | MotionValue<number>
  linearIconClass: string
  boldIconClass: string
}>()

const progressMotion = computed(() => {
  return isMotionValue(props.progress)
    ? props.progress
    : motionValue(props.progress)
})

const y = useComputed(() => {
  const progress = clamp(progressMotion.value.get(), 0, 1)
  return `${90 - progress * 80}%`
})
</script>

<template>
  <i class="relative inline-block size-[1em] transition-[color] duration-300">
    <i
      class="absolute inset-0"
      :class="linearIconClass"
    />

    <i
      class="absolute inset-0 bg-transparent!"
      :class="boldIconClass"
    >
      <Motion
        class="size-full translate-y-[calc(90%-var(--progress)*80%)] bg-current"
        :style="{ y }"
      />
    </i>
  </i>
</template>
