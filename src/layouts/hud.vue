<script lang="ts">
export * from '@/loaders'
</script>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Container from '@/components/kit/Container.vue'
import NavMenu from '@/components/NavMenu.vue'
</script>

<template>
  <Container class="relative min-h-dvh px-2.5 select-none">
    <RouterView />

    <div
      class="
        pointer-events-none fixed bottom-0 left-0 h-50 w-full bg-linear-0
        from-primary
      "
    />

    <Container class="fixed inset-x-0 bottom-8 px-2.5 select-none">
      <NavMenu />
    </Container>
  </Container>
</template>
