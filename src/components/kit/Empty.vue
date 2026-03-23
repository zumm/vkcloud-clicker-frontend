<script setup lang="ts">
defineProps<{
  icon: string
}>()
</script>

<template>
  <section
    class="
      flex aspect-video flex-col items-center justify-center rounded-lg border
      border-neutral-100 p-2
    "
  >
    <i
      class="text-2xl text-neutral-100"
      :class="icon"
    />

    <p class="mt-1 text-sm font-medium text-neutral-100">
      <slot />
    </p>
  </section>
</template>
