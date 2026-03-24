<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary'
}>(), {
  variant: 'primary',
})
</script>

<template>
  <div
    class="inline-block rounded-full px-3 py-1 text-xs/tight uppercase"
    :class="{
      'bg-primary text-neutral-100': variant === 'primary',
      'bg-secondary text-zinc-800': variant === 'secondary',
    }"
  >
    Суперприз
  </div>
</template>
