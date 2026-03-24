<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <Motion
    class="pointer-events-auto fixed inset-0 bg-zinc-800/45 backdrop-blur-xs"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
  />
</template>
