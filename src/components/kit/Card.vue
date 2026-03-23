<script setup lang="ts">
import CardTitle from '@/components/kit/CardTitle.vue'

defineProps<{
  title?: string
  accent?: boolean
}>()
</script>

<template>
  <section
    class="rounded-[0.625rem] border border-primary/20 p-4"
    :class="{
      'bg-neutral-100': !accent,
      'bg-secondary': accent,
    }"
  >
    <CardTitle v-if="title">
      {{ title }}
    </CardTitle>

    <slot />
  </section>
</template>
