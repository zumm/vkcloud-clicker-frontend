<script setup lang="ts">
import { storeToRefs } from 'pinia'
import JackpotBadge from '@/components/JackpotBadge.vue'
import Card from '@/components/kit/Card.vue'
import CardTitle from '@/components/kit/CardTitle.vue'
import ProgressBar from '@/components/kit/ProgressBar.vue'
import { useJackpot } from '@/loaders/gifts'
import { useAppStore } from '@/stores/app'
import { useProgressStore } from '@/stores/progress'

const { isPressed } = storeToRefs(useAppStore())
const { lastGift, nextGift, giftProgress } = storeToRefs(useProgressStore())
const { data: jackpot } = useJackpot()
</script>

<template>
  <Card
    v-if="nextGift || lastGift"
    class="p-2.5!"
    accent
  >
    <template v-if="nextGift">
      <CardTitle>
        <i class="icon-[linear--gift] text-[1.5rem]" />
        {{ nextGift.name }}
      </CardTitle>

      <ProgressBar
        class="mt-2"
        :progress-bar-class="isPressed ? 'text-primary-lighter!' : undefined"
        :progress="giftProgress"
        variant="game"
        no-marks
      />
    </template>
    <template v-else-if="lastGift">
      <CardTitle>
        <i class="icon-[linear--gift] text-[1.5rem]" />
        {{ jackpot.name }}

        <JackpotBadge
          class="ml-1"
          variant="primary"
        />
      </CardTitle>

      <p class="mt-2 text-xs/tight font-medium text-zinc-800">
        В конкурсе <b>«{{ jackpot.name }}»</b> участвуют все, кто получили подарок <b>«{{ lastGift.name }}»</b>.
        <b>И вы среди счастливчиков!</b>
      </p>
    </template>
  </Card>
</template>
