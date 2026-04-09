<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  progress: number
  variant?: 'simple' | 'game'
  progressBarClass?: string
  marksClass?: string
  startMark?: string
  endMark?: string
  noMarks?: boolean
}>(), {
  variant: 'simple',
  startMark: '0%',
  endMark: '100%',
  noMarks: false,
})

const clampedProgress = computed(() => clamp(props.progress, 0, 1))
</script>

<template>
  <div :style="{ '--progress': clampedProgress }">
    <div
      class="w-full overflow-hidden rounded-full bg-neutral-100 text-primary"
      :class="[{
        'h-2': variant === 'simple',
        'h-5': variant === 'game',
      }, progressBarClass]"
    >
      <div
        class="
          size-full translate-x-[calc(var(--progress)*100%-100%)] rounded-full
          bg-current transition-colors duration-300
        "
        :class="{
          'bg-[url(\'@/assets/progress-bar-bg.svg\')]': variant === 'game',
        }"
      />
    </div>

    <div
      v-if="!noMarks"
      class="mt-0.5 flex justify-between text-xs font-medium text-primary"
      :class="marksClass"
    >
      <span>{{ startMark }}</span>
      <span>{{ endMark }}</span>
    </div>
  </div>
</template>
