<script lang="ts">
import { RAFFLE_DATE_TEXT } from '@/env'
import { useEarnedGifts, useJackpot } from '@/loaders/gifts'

// all for local
export { useEarnedGifts, useJackpot }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import GiftCard from '@/components/GiftCard.vue'
import Container from '@/components/kit/Container.vue'
import TosLink from '@/components/TosLink.vue'
import { getLast } from '@/helpers/get-last'

const { data: earnedGifts } = useEarnedGifts()
const { data: jackpot } = useJackpot()

const bestEarnedGift = computed(() => getLast(earnedGifts.value))
</script>

<template>
  <Container
    v-if="bestEarnedGift"
    as="main"
    class="px-2.5 py-12.5"
  >
    <h1 class="mb-9 text-center text-3xl font-medium text-neutral-100">
      Ты накликал
      <span class="font-semibold text-secondary">
        {{ bestEarnedGift.name }}
      </span>
      в Облаке Mail
    </h1>

    <img
      v-if="bestEarnedGift.imageUrl"
      class="pointer-events-none mx-auto my-9 w-60 select-none"
      :src="bestEarnedGift.imageUrl"
      :alt="bestEarnedGift.name"
    >

    <p class="mt-4 text-center text-base font-medium text-neutral-100">
      Теперь ты участвуешь в розыгрыше
      <span class="font-semibold text-secondary">
        СУПЕРПРИЗА «{{ jackpot.name }}»
      </span>
      .

      Результаты объявим
      <span class="font-semibold text-secondary">
        {{ RAFFLE_DATE_TEXT }}
      </span>
      в чат-боте.
    </p>

    <GiftCard
      class="mt-9 w-full"
      :gift="bestEarnedGift"
    />

    <TosLink class="mt-9 text-center" />
  </Container>
</template>
