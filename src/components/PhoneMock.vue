<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import PhoneMockFeed from '@/components/PhoneMockFeed.vue'
import { useAppStore } from '@/stores/app'
import { useBoostersStore } from '@/stores/boosters'

const { isPressed } = storeToRefs(useAppStore())
const { clickPower } = storeToRefs(useBoostersStore())

const timeString = useDateFormat(useNow({ interval: 1000 }), 'HH:mm')
</script>

<template>
  <div class="relative min-h-68.25 w-62.5 px-3.25 py-2.75">
    <div
      class="
        absolute inset-x-0.5 inset-y-0 rounded-[2.375rem]
        shadow-[1px_3px_15px_0] transition-shadow duration-100
      "
      :class="{
        'shadow-zinc-800/35': !isPressed,
        'shadow-secondary/65': isPressed,
        'shadow-[2px_6px_30px_0]! shadow-orange-600!': clickPower > 1,
      }"
    />

    <div class="absolute inset-0 flex flex-col">
      <img
        src="@/assets/phone/bg-top.png"
        class="w-full shrink-0"
      >

      <img
        src="@/assets/phone/bg-middle.png"
        class="w-full grow"
      >

      <img
        src="@/assets/phone/bg-bottom.png"
        class="w-full shrink-0"
      >
    </div>

    <div class="relative h-full overflow-hidden rounded-[1.75rem] bg-neutral-100">
      <PhoneMockFeed class="size-full" />

      <img
        src="@/assets/phone/overlay.png"
        class="absolute top-0 left-0 w-full"
      >

      <div class="absolute top-0 left-0 w-full px-4 py-1.5">
        <p class="text-[0.625rem]/none font-semibold text-neutral-100">
          {{ timeString }}
        </p>
      </div>
    </div>
  </div>
</template>
