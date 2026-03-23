<script setup lang="ts">
import type { GetMilestonesResponse } from '@/api'

defineProps<{
  milestone: GetMilestonesResponse['items'][number]
}>()
</script>

<template>
  <section class="flex gap-0.5 rounded-lg bg-secondary p-1 pr-2">
    <i class="icon-[linear--flash] text-lg text-primary" />

    <p class="text-xs font-medium text-zinc-800">
      Продолжай кликать и получи ускорение!
    </p>
  </section>
</template>
