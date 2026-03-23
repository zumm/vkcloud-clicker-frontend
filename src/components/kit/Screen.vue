<script setup lang="ts">
import Container from '@/components/kit/Container.vue'

withDefaults(defineProps<{
  as?: string
}>(), {
  as: 'main',
})
</script>

<template>
  <Container
    :as="as"
    class="flex min-h-dvh flex-col"
  >
    <slot />
  </Container>
</template>
