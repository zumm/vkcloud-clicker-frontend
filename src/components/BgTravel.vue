<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { clamp, Motion, motionValue, useMotionValueEvent, useSpring } from 'motion-v'
import { storeToRefs } from 'pinia'
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue'
import { preloadImageQuietly } from '@/helpers/preload-image'
import { useProgressStore } from '@/stores/progress'

const CHUNKS = Object.values(import.meta.glob<string>('@/assets/bg/*.webp', { eager: true, import: 'default' })).reverse()
const CHUNK_WIDTH = 1144
const CHUNK_HEIGHT = 285
const TOTAL_HEIGHT = CHUNKS.length * CHUNK_HEIGHT

const { totalProgress: progress } = storeToRefs(useProgressStore())

const viewportRef = useTemplateRef('viewportRef')
const { width: viewportWidth, height: viewportHeight } = useElementSize(viewportRef)

const maxOffset = computed(() => {
  return Math.max(0, TOTAL_HEIGHT - viewportHeight.value)
})

const y = motionValue(0)
watchEffect(() => {
  y.set(Math.ceil(0 + progress.value * maxOffset.value))
})

const y_ = useSpring(y, { restDelta: 1, restSpeed: 100 })

// preventing animations to initial state
watch(viewportWidth, (_, oldValue) => {
  if (oldValue === 0) {
    y_.jump(y.get())
  }
})

const chunksPerViewport = computed(() => Math.ceil(viewportHeight.value / CHUNK_HEIGHT) + 2)
const getChunkIndexByOffset = (offset: number) => {
  return clamp(0, CHUNKS.length - chunksPerViewport.value, Math.floor(offset / CHUNK_HEIGHT))
}

const chunkIndex = ref(0)
const updateChunkIndex = (y: number) => {
  chunkIndex.value = getChunkIndexByOffset(y - CHUNK_HEIGHT)
}

useMotionValueEvent(y_, 'change', updateChunkIndex)
updateChunkIndex(y_.get())

const visibleChunks = computed(() => {
  return CHUNKS.slice(chunkIndex.value, chunkIndex.value + chunksPerViewport.value).reverse()
})

watchEffect(() => {
  const url = CHUNKS[chunkIndex.value + chunksPerViewport.value]
  url && preloadImageQuietly(url)
})

const localY = motionValue(0)
const updateLocalY = (y: number) => {
  localY.set(y - chunkIndex.value * CHUNK_HEIGHT)
}

useMotionValueEvent(y_, 'change', updateLocalY)
updateLocalY(y_.get())

const CHUNK_STYLES = {
  width: `${CHUNK_WIDTH}px`,
  height: `${CHUNK_HEIGHT}px`,
}
</script>

<template>
  <div
    ref="viewportRef"
    class="pointer-events-none relative overflow-hidden select-none"
  >
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
      <Motion
        class="origin-bottom will-change-transform"
        :style="{ y: localY }"
      >
        <img
          v-for="chunk in visibleChunks"
          :key="chunk"
          :src="chunk"
          :style="CHUNK_STYLES"
          class="max-w-none bg-neutral-100"
        >
      </Motion>
    </div>
  </div>
</template>
