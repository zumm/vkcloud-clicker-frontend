<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PhoneMockFeed from '@/components/PhoneMockFeed.vue'
import { useAppStore } from '@/stores/app'

const { isPressed } = storeToRefs(useAppStore())
</script>

<template>
  <div
    class="
      h-full overflow-hidden rounded-4xl border-3 border-zinc-800 bg-neutral-100
      shadow-[1px_3px_15px_0] transition-shadow duration-100
    "
    :class="{
      'shadow-zinc-800/35': !isPressed,
      'shadow-secondary/65': isPressed,
    }"
  >
    <PhoneMockFeed class="size-full" />
  </div>
</template>
