<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { Motion, motionValue, useMotionValueEvent, useTime } from 'motion-v'
import { computed, useTemplateRef } from 'vue'

const COLUMN_COUNT = 4
const IMAGES = Object.values(import.meta.glob<string>('@/assets/feed/*.webp', { eager: true, import: 'default' }))

const viewportRef = useTemplateRef('viewportRef')
const probeRef = useTemplateRef('probeRef')

const { height } = useElementSize(viewportRef)
const { height: rowHeight } = useElementSize(probeRef)

const rowCount = computed(() => Math.ceil(height.value / rowHeight.value) + 1)
const rowsHeight = computed(() => rowCount.value * rowHeight.value)
const rows = computed(() => {
  return Array.from({ length: rowCount.value }, () => motionValue(0))
})

const CYCLE_DURATION = 10000
const time = useTime()
useMotionValueEvent(time, 'change', (time) => {
  const progress = (time % CYCLE_DURATION) / CYCLE_DURATION
  const progressOffset = progress * rowsHeight.value

  for (const [index, y] of rows.value.entries()) {
    const rowOffset = index * rowHeight.value

    let value = progressOffset * -1
    if (value + rowOffset < rowHeight.value * -1) {
      value += rowsHeight.value
    }

    y.set(value)
  }
})

const getGridImage = (row: number, column: number) => {
  const index = COLUMN_COUNT * row + column
  return IMAGES[index % IMAGES.length]
}
</script>

<template>
  <section
    ref="viewportRef"
    class="relative overflow-hidden px-0.5"
  >
    <div
      ref="probeRef"
      class="absolute h-15"
    />

    <Motion
      v-for="(y, rowIndex) in rows"
      :key="rowIndex"
      class="mb-0.5 flex gap-0.5"
      :style="{ y }"
    >
      <div
        v-for="columnIndex in COLUMN_COUNT"
        :key="columnIndex"
        class="
          size-14.5 rounded-[0.1875rem] bg-primary-lightest bg-cover
          bg-no-repeat
        "
        :style="{ backgroundImage: `url('${getGridImage(rowIndex, columnIndex - 1)}')` }"
      />
    </Motion>
  </section>
</template>
