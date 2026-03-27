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
  <section class="flex items-center gap-1 rounded-lg bg-primary p-2 pr-3">
    <ProgressIcon
      class="text-3xl text-secondary"
      linear-icon-class="icon-[linear--flash]"
      bold-icon-class="icon-[bold--flash]"
      :progress="progress"
    />

    <p class="text-xs/tight font-medium text-neutral-100">
      Продолжай кликать<br>
      и получи ускорение!
    </p>
  </section>
</template>
