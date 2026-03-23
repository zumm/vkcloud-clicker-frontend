<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
}>(), {
  as: 'section',
})
</script>

<template>
  <component
    :is="as"
    class="mx-auto max-w-md min-w-75"
  >
    <slot />
  </component>
</template>
