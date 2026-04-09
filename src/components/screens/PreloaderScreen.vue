<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/kit/ProgressBar.vue'
import Screen from '@/components/kit/Screen.vue'

const props = defineProps<{
  progress: number
}>()

const progressString = computed(() => `${Math.round(props.progress * 100)}%`)
</script>

<template>
  <Screen class="items-center justify-center">
    <i class="icon-[linear--cloud] text-[6.25rem] text-neutral-100" />

    <p class="my-5 text-xl font-medium text-neutral-100">
      Запускаем облако...
    </p>

    <ProgressBar
      class="w-full"
      progress-bar-class="bg-neutral-100/20! text-neutral-100!"
      :progress="progress"
      no-marks
    />

    <p class="my-5 text-xl font-medium text-neutral-100">
      {{ progressString }}
    </p>
  </Screen>
</template>
