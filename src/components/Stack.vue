<script setup lang="ts" generic="T">
import { AnimatePresence, LayoutGroup } from 'motion-v'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  items: T[]
  limit?: number
}>(), {
  limit: 5,
})

const visibleItems = computed(() => props.items.slice(-props.limit))
</script>

<template>
  <section class="flex flex-col items-center gap-1">
    <LayoutGroup>
      <AnimatePresence>
        <slot
          v-for="item in visibleItems"
          v-bind="{ item }"
        />
      </AnimatePresence>
    </LayoutGroup>
  </section>
</template>
