<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PhoneMockFeed from '@/components/PhoneMockFeed.vue'
import { useAppStore } from '@/stores/app'
import { useBoostersStore } from '@/stores/boosters'

const { isPressed } = storeToRefs(useAppStore())
const { clickPower } = storeToRefs(useBoostersStore())
</script>

<template>
  <div class="relative p-px">
    <div class="absolute top-20 -left-0.5 h-2.5 w-0.5 rounded-l-xs bg-slate-800" />
    <div class="absolute top-25 -left-0.5 h-8 w-0.5 rounded-l-xs bg-slate-800" />
    <div class="absolute top-35.5 -left-0.5 h-8 w-0.5 rounded-l-xs bg-slate-800" />

    <div class="absolute top-25 -right-0.5 h-12.5 w-0.5 rounded-r-xs bg-slate-800" />

    <div
      class="
        h-full overflow-hidden rounded-4xl border-3 border-zinc-800
        bg-neutral-100 shadow-[1px_3px_15px_0] outline-1 outline-slate-800
        transition-shadow duration-100
      "
      :class="{
        'shadow-zinc-800/35': !isPressed,
        'shadow-secondary/65': isPressed,
        'shadow-[2px_6px_30px_0]! shadow-orange-600!': clickPower > 1,
      }"
    >
      <PhoneMockFeed class="size-full" />
    </div>
  </div>
</template>
