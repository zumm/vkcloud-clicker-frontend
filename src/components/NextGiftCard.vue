<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Card from '@/components/kit/Card.vue'
import CardTitle from '@/components/kit/CardTitle.vue'
import ProgressBar from '@/components/kit/ProgressBar.vue'
import { useProgressStore } from '@/stores/progress'

const { nextGift, progress } = storeToRefs(useProgressStore())
</script>

<template>
  <Card
    v-if="nextGift"
    class="p-2.5!"
    accent
  >
    <CardTitle>
      <i class="icon-[linear--gift] text-[1.5rem]" />
      {{ nextGift.name }}
    </CardTitle>

    <ProgressBar
      class="mt-2"
      :progress="progress"
      no-marks
    />
  </Card>
</template>
