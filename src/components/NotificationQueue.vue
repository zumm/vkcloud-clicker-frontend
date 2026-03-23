<script setup lang="ts">
import type { MotionProps } from 'motion-v'
import type { Component } from 'vue'
import { AnimatePresence } from 'motion-v'
import { onUnmounted, shallowRef } from 'vue'
import SlapAnimation from '@/components/SlapAnimation.vue'

export interface Notification<T extends Record<string, unknown>> {
  id: string
  durationMs: number
  component: Component<T>
  props: T
  slapProps?: MotionProps
  onComplete?: (notification: Notification<T>) => void
}

let timerId: number | undefined
const current = shallowRef<Notification<any> | undefined>()
const queue: Notification<any>[] = []

const onTimeout = () => {
  current.value?.onComplete?.(current.value)
  current.value = undefined
  timerId = undefined
}

const dequeue = () => {
  if (current.value != null || queue.length === 0) {
    return
  }

  current.value = queue.shift()
  timerId = setTimeout(onTimeout, current.value!.durationMs)
}

const push = <T extends Record<string, unknown>>(notification: Notification<T>) => {
  queue.push(notification)
  dequeue()
}

const onExitComplete = () => {
  dequeue()
}

onUnmounted(() => {
  clearTimeout(timerId)
})

defineExpose({
  push,
})
</script>

<template>
  <section class="flex items-center justify-center">
    <AnimatePresence
      mode="wait"
      @exit-complete="onExitComplete"
    >
      <SlapAnimation
        v-if="current"
        :key="current.id"
        v-bind="current.slapProps"
      >
        <component
          :is="current.component"
          v-bind="current.props"
        />
      </SlapAnimation>
    </AnimatePresence>
  </section>
</template>
