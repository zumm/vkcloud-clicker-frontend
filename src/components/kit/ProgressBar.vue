<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  progress: number
  progressBarClass?: string
  marksClass?: string
  startMark?: string
  endMark?: string
  noMarks?: boolean
}>(), {
  startMark: '0%',
  endMark: '100%',
  noMarks: false,
})

const clampedProgress = computed(() => clamp(props.progress, 0, 1))
</script>

<template>
  <div :style="{ '--progress': clampedProgress }">
    <div
      class="
        h-5 w-full overflow-hidden rounded-full bg-neutral-100 text-primary
      "
      :class="progressBarClass"
    >
      <div
        class="
          h-5 w-full translate-x-[calc(var(--progress)*100%-100%)] rounded-full
          bg-current bg-[url('@/assets/progress-bar-bg.svg')]
          transition-[translate,color] duration-300
        "
      />
    </div>

    <div
      v-if="!noMarks"
      class="mt-0.5 flex justify-between text-xs font-medium"
      :class="marksClass"
    >
      <span class="text-primary">{{ startMark }}</span>
      <span class="text-zinc-800">{{ endMark }}</span>
    </div>
  </div>
</template>
