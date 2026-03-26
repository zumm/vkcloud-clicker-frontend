<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  progress: number
  linearIconClass: string
  boldIconClass: string
}>()

const clampedProgress = computed(() => clamp(props.progress, 0, 1))
</script>

<template>
  <i
    class="relative inline-block size-[1em] transition-[color] duration-300"
    :style="{ '--progress': clampedProgress }"
  >
    <i
      class="absolute inset-0"
      :class="linearIconClass"
    />

    <i
      class="absolute inset-0 bg-transparent!"
      :class="boldIconClass"
    >
      <div
        class="
          size-full translate-y-[calc(90%-var(--progress)*80%)] bg-current
          transition-[translate,color] duration-300
        "
      />
    </i>
  </i>
</template>
