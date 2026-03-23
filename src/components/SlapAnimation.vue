<script setup lang="ts">
import { Motion } from 'motion-v'

const CORNERS = [
  { classes: 'top-0 left-0', xf: -1, yf: -1, r: 0 },
  { classes: 'bottom-0 left-0', xf: -1, yf: 1, r: 270 },
  { classes: 'top-0 right-0', xf: 1, yf: -1, r: 90 },
  { classes: 'bottom-0 right-0', xf: 1, yf: 1, r: 180 },
]
</script>

<template>
  <Motion class="relative">
    <Motion
      as-child
      :initial="{ scale: 1.3, opacity: 0.5 }"
      :animate="{ scale: 1, opacity: 1 }"
      :exit="{ scale: 1.1, opacity: 0 }"
    >
      <slot />
    </Motion>

    <Motion
      v-for="({ classes, xf, yf, r }, index) of CORNERS"
      :key="index"
      as-child
      :initial="{ opacity: 0, scale: 0, rotate: r }"
      :animate="{ x: `${75 * xf}%`, y: `${75 * yf}%`, opacity: 1, scale: 1, transition: { delay: 0.05 } }"
      :exit="{ x: `${150 * xf}%`, y: `${150 * yf}%`, opacity: 0, scale: 2 }"
    >
      <img
        src="@/assets/slap.svg"
        class="absolute animate-wiggle animate-add"
        :class="classes"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
    </Motion>
  </Motion>
</template>
