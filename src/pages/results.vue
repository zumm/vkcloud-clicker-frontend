<script lang="ts">
import { useEarnedGifts, useJackpot } from '@/loaders/gifts'
import { useUserData } from '@/loaders/user-data'

// all for local
export { useEarnedGifts, useJackpot, useUserData }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import GiftCard from '@/components/GiftCard.vue'
import JackpotCard from '@/components/JackpotCard.vue'
import Container from '@/components/kit/Container.vue'
import Empty from '@/components/kit/Empty.vue'
import TosLink from '@/components/TosLink.vue'
import { getLast } from '@/helpers/get-last'

const { data: userData } = useUserData()
const { data: earnedGifts } = useEarnedGifts()
const { data: jackpot } = useJackpot()

const bestEarnedGift = computed(() => getLast(earnedGifts.value))
</script>

<template>
  <Container
    as="main"
    class="px-2.5 py-12.5"
  >
    <h1 class="mb-9 text-center text-3xl font-medium text-neutral-100">
      Конкурс завершён!
    </h1>

    <template v-if="userData.promocode">
      <p class="mb-8 text-center text-xl font-medium text-secondary">
        Ты выиграл СУПЕРПРИЗ!
      </p>

      <img
        v-if="jackpot.imageUrl"
        class="pointer-events-none mx-auto mb-8 w-60 select-none"
        :src="jackpot.imageUrl"
        :alt="jackpot.name"
      >

      <GiftCard
        v-if="bestEarnedGift"
        :gift="bestEarnedGift"
        details-mode="legal"
      />

      <JackpotCard
        class="mt-2.5"
        :name="jackpot.name"
        :code="userData.promocode"
        participated
      />
    </template>
    <template v-else-if="bestEarnedGift">
      <p class="mb-8 text-center text-xl font-medium text-secondary">
        Ты выиграл: {{ bestEarnedGift.name }}
      </p>

      <img
        v-if="bestEarnedGift.imageUrl"
        class="pointer-events-none mx-auto mb-8 w-60 select-none"
        :src="bestEarnedGift.imageUrl"
        :alt="bestEarnedGift.name"
      >

      <GiftCard
        :gift="bestEarnedGift"
        details-mode="short-legal"
      />
    </template>
    <template v-else>
      <p class="mb-8 text-center text-xl font-medium text-secondary">
        Ты не успел ничего выиграть :(
      </p>

      <img
        class="pointer-events-none mx-auto mb-8 w-60 select-none"
        src="@/assets/gifts.webp"
        alt="Призы"
      >

      <Empty icon="icon-[linear--gift]">
        Нет доступных призов
      </Empty>
    </template>

    <TosLink class="mt-9 text-center" />
  </Container>
</template>
