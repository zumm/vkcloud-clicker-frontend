<script setup lang="ts">
defineProps<{
  firstGift: { name: string }
}>()
</script>

<template>
  <section class="rounded-lg bg-neutral-100 p-2.5">
    <p class="text-sm font-medium text-zinc-800">
      Начинай кликать на первый приз:
    </p>

    <p class="mb-1 text-center text-base font-medium text-primary">
      {{ firstGift.name }}!
    </p>
  </section>
</template>
