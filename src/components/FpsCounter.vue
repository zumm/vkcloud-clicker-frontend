<script setup lang="ts">
import { useFps } from '@vueuse/core'

const fps = useFps()
</script>

<template>
  <div class="bg-white px-2 py-1 font-mono">
    {{ fps }}
  </div>
</template>
