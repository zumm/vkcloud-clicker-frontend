<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
  variance?: 'default' | 'accent'
  isLoading?: boolean
}>(), {
  as: 'button',
  variance: 'default',
})
</script>

<template>
  <component
    :is="as"
    class="
      cursor-pointer rounded-lg px-4.5 py-3 text-sm/4 font-medium
      disabled:cursor-default disabled:bg-zinc-800/5 disabled:text-zinc-800/60
    "
    :class="{
      'bg-primary-darker text-neutral-100': variance === 'default',
      'bg-secondary text-zinc-800': variance === 'accent',
      'pointer-events-none': isLoading,
    }"
  >
    <i
      v-if="isLoading"
      class="mx-auto icon-[default--spinner] animate-spin"
    />
    <slot v-else />
  </component>
</template>
