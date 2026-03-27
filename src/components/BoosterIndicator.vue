<script setup lang="ts">
import type { UserBoosterViewDto } from '@/api'
import { useRafFn } from '@vueuse/core'
import { motionValue } from 'motion-v'
import { computed, watch } from 'vue'
import ProgressIcon from '@/components/kit/ProgressIcon.vue'

const props = defineProps<{
  booster: UserBoosterViewDto
}>()

const progress = motionValue(1)

const activatedAt = computed(() => (props.booster.activatedAt ?? new Date()).valueOf())
const expiresAt = computed(() => props.booster.expiresAt?.valueOf() ?? Infinity)

const { pause, resume } = useRafFn(() => {
  if (expiresAt.value === Infinity) {
    progress.set(1)
    pause()
    return
  }

  const duaration = expiresAt.value - activatedAt.value
  const timeLeft = expiresAt.value - Date.now()

  let newProgress = timeLeft / duaration
  if (newProgress <= 0) {
    newProgress = 0
    pause()
  }

  progress.set(newProgress)
}, { immediate: true })

watch(() => props.booster, () => resume())
</script>

<template>
  <section class="flex gap-1 rounded-lg bg-secondary p-2 pr-3">
    <ProgressIcon
      class="animate-wiggle text-3xl text-primary"
      linear-icon-class="icon-[linear--flash]"
      bold-icon-class="icon-[bold--flash]"
      :progress="progress"
    />

    <p class="text-xs/tight font-medium text-zinc-800">
      Получено ускорение!<br>
      {{ booster.name }}
    </p>
  </section>
</template>
