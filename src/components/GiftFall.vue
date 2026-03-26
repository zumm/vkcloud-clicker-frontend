<script setup lang="ts">
import type { TransformTemplate, VariantType } from 'motion-v'
import { Motion } from 'motion-v'

type Variants = Record<string, VariantType | ((custom: any) => VariantType)>

const COLUM_COUNT = 5
const ROW_COUNT = 6
const ITEM_COUNT = COLUM_COUNT * ROW_COUNT

const FALL_DURATION = 5
const TILT_DURATION = 2

// tie fall speed to size
const random = Array.from({ length: ITEM_COUNT }, () => Math.random())

const variants: Variants = {
  initial: (index: number) => ({
    y: '-10dvh',
    left: `${(50 + (index % COLUM_COUNT) * 100) / COLUM_COUNT}%`,
    scale: 1 + random[index]!,
  }),
  fall: (index: number) => ({
    y: '110dvh',
    transition: {
      duration: FALL_DURATION * (1 - random[index]! * 0.5),
      delay: Math.floor(index / COLUM_COUNT) * FALL_DURATION / ROW_COUNT + Math.random(),
      repeat: Infinity,
      ease: 'linear',
    },
  }),
  tilt: (index: number) => ({
    rotate: [-5 - random[index]! * 5, 5 + random[index]! * 5],
    transition: {
      duration: TILT_DURATION,
      delay: Math.random() * -TILT_DURATION,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    },
  }),
  exit: {
    scale: 3,
    opacity: 0,
  },
}

const transformTemplate: TransformTemplate = ({ rotate, y, scale }) => {
  return `rotate(${rotate}) translateY(${y}) scale(${scale})`
}
</script>

<template>
  <div class="pointer-events-none fixed inset-0 overflow-hidden">
    <Motion
      v-for="index in ITEM_COUNT"
      :key="index"
      as="i"
      class="absolute icon-[linear--gift] text-base text-secondary"
      :custom="index - 1"
      :variants="variants"
      :transform-template="transformTemplate"
      initial="initial"
      :animate="['tilt', 'fall']"
      exit="exit"
    />
  </div>
</template>
