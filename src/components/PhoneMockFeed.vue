<script setup lang="ts">
import type { MotionValue } from 'motion-v'
import { useElementSize } from '@vueuse/core'
import { Motion, motionValue, useMotionValueEvent, useTime } from 'motion-v'
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import { FEED_SPEED } from '@/env'

const COLUMN_COUNT = 4
const IMAGES = Object.values(import.meta.glob<string>('@/assets/feed/*.webp', { eager: true, import: 'default' }))

const virtualRowCount = Math.max(1, Math.floor(IMAGES.length / COLUMN_COUNT))

const viewportRef = useTemplateRef('viewportRef')
const probeRef = useTemplateRef('probeRef')

const { height } = useElementSize(viewportRef)
const { height: rowHeight } = useElementSize(probeRef)

const rowCount = computed(() => {
  return (height.value && rowHeight.value)
    // add two extra rows:
    // - one to cover scroll gap
    // - one to prevent flickering when background images update
    ? Math.ceil(height.value / rowHeight.value) + 2
    : 0
})
const rowsHeight = computed(() => rowCount.value * rowHeight.value)

const rows = shallowRef<Array<{
  y: MotionValue<number>
  virtualRowIndex: number
}>>([])

watch([rowCount, rowHeight], () => {
  rows.value = Array.from({ length: rowCount.value }, (_, index) => ({
    y: motionValue(index * rowHeight.value),
    virtualRowIndex: index % virtualRowCount,
  }))
})

const getCellImage = (rowIndex: number, columnIndex: number) => {
  const index = COLUMN_COUNT * rowIndex + columnIndex
  return `url('${IMAGES[index % IMAGES.length]}')`
}

// avoid vue re-render overhead by updating bg images directly
const cellsRef = useTemplateRef('cellsRef')
const updateRowCells = (rowIndex: number, virtualRowIndex: number) => {
  for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex++) {
    const cellIndex = rowIndex * COLUMN_COUNT + columnIndex
    // order isn't guaranteed, but we have faith
    // TODO: reimplement with custom ref store function
    const cell = cellsRef.value?.[cellIndex]

    if (cell) {
      cell.style.backgroundImage = getCellImage(virtualRowIndex, columnIndex)
    }
  }
}

const time = useTime()
useMotionValueEvent(time, 'change', () => {
  if (!cellsRef.value) {
    return
  }

  const delta = time.get() - (time.getPrevious() ?? 0)
  const offset = delta * FEED_SPEED / 1000

  for (const [rowIndex, row] of rows.value.entries()) {
    let y = row.y.get()
    y -= offset

    if (y < rowHeight.value * -1) {
      y += rowsHeight.value

      row.virtualRowIndex += rowCount.value
      row.virtualRowIndex %= virtualRowCount

      updateRowCells(rowIndex, row.virtualRowIndex)
    }

    row.y.set(y)
  }
})
</script>

<template>
  <section
    ref="viewportRef"
    class="relative overflow-hidden px-0.5"
  >
    <div
      ref="probeRef"
      class="h-15 w-59.5"
    />

    <Motion
      v-for="({ y, virtualRowIndex }, rowIndex) in rows"
      :key="rowIndex"
      class="absolute top-0 flex gap-0.5"
      :style="{ y }"
    >
      <div
        v-for="columnIndex in COLUMN_COUNT"
        :key="columnIndex"
        ref="cellsRef"
        class="
          size-14.5 rounded-[0.1875rem] bg-primary-lightest bg-cover
          bg-no-repeat
        "
        :style="{ backgroundImage: getCellImage(virtualRowIndex, columnIndex) }"
      />
    </Motion>
  </section>
</template>
