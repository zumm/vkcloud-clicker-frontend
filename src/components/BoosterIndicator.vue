<script setup lang="ts">
import type { UserBoosterViewDto } from '@/api'
import { useRafFn } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import ProgressIcon from '@/components/kit/ProgressIcon.vue'

const props = defineProps<{
  booster: UserBoosterViewDto
}>()

const progress = shallowRef(1)

const activatedAt = computed(() => (props.booster.activatedAt ?? new Date()).valueOf())
const expiresAt = computed(() => props.booster.expiresAt?.valueOf() ?? Infinity)

const { pause, resume } = useRafFn(() => {
  if (expiresAt.value === Infinity) {
    progress.value = 1
    pause()
    return
  }

  const duaration = expiresAt.value - activatedAt.value
  const timeLeft = expiresAt.value - Date.now()
  progress.value = timeLeft / duaration

  if (progress.value <= 0) {
    progress.value = 0
    pause()
  }
}, { immediate: true, fpsLimit: 10 })

watch(() => props.booster, () => resume())
</script>

<template>
  <section class="flex gap-0.5 rounded-lg bg-secondary p-1 pr-2">
    <ProgressIcon
      class="text-lg text-orange-600"
      linear-icon-class="icon-[linear--flash]"
      bold-icon-class="icon-[bold--flash]"
      :progress="progress"
    />

    <p class="text-xs font-medium text-zinc-800">
      Получено ускорение! {{ booster.name }}
    </p>
  </section>
</template>
