<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { Motion, motionValue, useSpring } from 'motion-v'
import { storeToRefs } from 'pinia'
import { computed, useTemplateRef, watch, watchEffect } from 'vue'
import PhoneMock from '@/components/PhoneMock.vue'
import { useProgressStore } from '@/stores/progress'

const { progress } = storeToRefs(useProgressStore())

const rootRef = useTemplateRef('rootRef')
const { height: rootHeight } = useElementSize(rootRef)

const phoneMinHeight = computed(() => 480)
const phoneMaxHeight = rootHeight

const PERSPECTIVE = 1200
const ALPHA = 30 * (Math.PI / 180) // x rotation
const COS_ALPHA = Math.cos(ALPHA)
const SIN_ALPHA = Math.sin(ALPHA)

const getRealHeight = (height: number) => {
  return (height * PERSPECTIVE) / (COS_ALPHA * PERSPECTIVE - SIN_ALPHA * height)
}

const phoneRealMinHeight = computed(() => getRealHeight(phoneMinHeight.value))
const phoneRealMaxHeight = computed(() => getRealHeight(phoneMaxHeight.value))
const phoneYOffset = computed(() => phoneRealMaxHeight.value - phoneRealMinHeight.value)

const y = motionValue(0)
watchEffect(() => {
  y.set((1 - progress.value) * phoneYOffset.value)
})

const y_ = useSpring(y)

// preventing animations to initial state
watch(rootHeight, (_, oldValue) => {
  if (oldValue === 0) {
    y_.jump(y.get())
  }
})
</script>

<template>
  <div
    ref="rootRef"
    class="
      relative flex justify-center overflow-hidden perspective-distant
      perspective-origin-bottom
    "
  >
    <div class="absolute bottom-0 w-fit origin-bottom rotate-x-30">
      <Motion
        as-child
        :style="{
          height: `${phoneRealMaxHeight}px`,
          y: y_,
        }"
      >
        <PhoneMock />
      </Motion>
    </div>
  </div>
</template>
