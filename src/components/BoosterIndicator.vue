<script setup lang="ts">
import type { UserBoosterViewDto } from '@/api'

defineProps<{
  booster: UserBoosterViewDto
}>()
</script>

<template>
  <section class="flex gap-0.5 rounded-lg bg-secondary p-1 pr-2">
    <i class="icon-[bold--flash] text-lg text-primary" />

    <p class="text-xs font-medium text-zinc-800">
      Получено ускорение! {{ booster.name }}
    </p>
  </section>
</template>
