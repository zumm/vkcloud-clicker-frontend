<script setup lang="ts">
import { clamp, useElementSize } from '@vueuse/core'
import { Motion, motionValue, useMotionValueEvent, useSpring } from 'motion-v'
import { storeToRefs } from 'pinia'
import { computed, shallowRef, useTemplateRef, watch, watchEffect } from 'vue'
import { preloadImageQuietly } from '@/helpers/preload-image'
import { useProgressStore } from '@/stores/progress'

const CHUNKS = Object.values(import.meta.glob<string>('@/assets/bg/*.png', { eager: true, import: 'default' })).reverse()
const CHUNK_COUNT = CHUNKS.length
const CHUNK_WIDTH = 448
const CHUNK_HEIGHT = 500
const TOTAL_HEIGHT = CHUNK_COUNT * CHUNK_HEIGHT

const { totalProgress: progress } = storeToRefs(useProgressStore())

const viewportRef = useTemplateRef('viewportRef')
const { width: viewportWidth, height: viewportHeight } = useElementSize(viewportRef)

const maxOffset = computed(() => {
  return Math.max(0, TOTAL_HEIGHT - viewportHeight.value)
})

const y = motionValue(0)
watchEffect(() => {
  y.set(progress.value * maxOffset.value)
})

const y_ = useSpring(y, { restDelta: 1, restSpeed: 100 })

// preventing animations to initial state
watch(viewportWidth, (_, oldValue) => {
  if (oldValue === 0) {
    y_.jump(y.get())
  }
})

const chunksPerViewport = computed(() => Math.ceil(viewportHeight.value / CHUNK_HEIGHT) + 1)
const getChunkIndexByOffset = (offset: number) => {
  return clamp(Math.floor(offset / CHUNK_HEIGHT), 0, CHUNK_COUNT - chunksPerViewport.value)
}

const chunkIndex = shallowRef(0)
const updateChunkIndex = (y: number) => {
  chunkIndex.value = getChunkIndexByOffset(y)
}

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

const onYChange = (y: number) => {
  const roudedY = Math.round(y)

  updateChunkIndex(roudedY)
  updateLocalY(roudedY)
}

useMotionValueEvent(y_, 'change', onYChange)
onYChange(y_.get())

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
        class="origin-bottom"
        :style="{ y: localY }"
      >
        <img
          v-for="chunk in visibleChunks"
          :key="chunk"
          :src="chunk"
          :style="CHUNK_STYLES"
          class="max-w-none bg-neutral-100"
          decoding="sync"
        >
      </Motion>
    </div>
  </div>
</template>
