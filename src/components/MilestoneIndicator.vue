<script setup lang="ts">
import type { GetMilestonesResponse } from '@/api'
import { clamp } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import ProgressIcon from '@/components/kit/ProgressIcon.vue'
import { MILESTONE_EPSILON } from '@/env'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{
  milestone: GetMilestonesResponse['items'][number]
}>()

const { balance } = storeToRefs(useProgressStore())
const progress = computed(() => clamp((balance.value - props.milestone.target) / MILESTONE_EPSILON + 1, 0, 1))
</script>

<template>
  <section class="flex gap-0.5 rounded-lg bg-secondary p-1 pr-2">
    <ProgressIcon
      class="text-lg text-primary"
      linear-icon-class="icon-[linear--flash]"
      bold-icon-class="icon-[bold--flash]"
      :progress="progress"
    />

    <p class="text-xs font-medium text-zinc-800">
      Продолжай кликать и получи ускорение!
    </p>
  </section>
</template>
