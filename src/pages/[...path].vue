<script setup lang="ts">
import Button from '@/components/kit/Button.vue'
</script>

<template>
  <main
    class="
      mx-auto flex min-h-dvh max-w-md min-w-75 flex-col items-center
      justify-center
    "
  >
    <h1 class="mb-5 text-9xl font-bold text-neutral-100">
      404
    </h1>

    <Button @click="$router.back()">
      Назад
    </Button>
  </main>
</template>
