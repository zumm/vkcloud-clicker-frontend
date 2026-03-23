<script setup lang="ts">
import { RouterLink } from 'vue-router'

const NAVIGATION = [{
  title: 'Играть',
  icon: 'icon-[linear--cloud]',
  to: '/',
}, {
  title: 'Призы',
  icon: 'icon-[linear--gift]',
  to: '/gifts',
}] as const
</script>

<template>
  <nav
    class="
      flex justify-between gap-1.25 rounded-[0.625rem] border border-primary/20
      bg-primary-lightest p-1.25
    "
  >
    <RouterLink
      v-for="{ title, icon, to } in NAVIGATION"
      :key="to"
      :to="to"
      active-class="bg-neutral-100"
      class="
        flex w-full flex-col items-center rounded-lg px-2.5 py-2 text-[0.625rem]
        font-medium text-primary uppercase
      "
    >
      <i
        class="block text-2xl"
        :class="icon"
      />

      {{ title }}
    </RouterLink>
  </nav>
</template>
