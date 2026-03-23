<script lang="ts">
import { useEarnedGifts, useGifts, useJackpot } from '@/loaders/gifts'
import { useUserData } from '@/loaders/user-data'

export { useEarnedGifts, useGifts, useJackpot, useUserData }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import GiftCard from '@/components/GiftCard.vue'
import JackpotCard from '@/components/JackpotCard.vue'
import Block from '@/components/kit/Block.vue'
import BlockTitle from '@/components/kit/BlockTitle.vue'
import Empty from '@/components/kit/Empty.vue'
import TosLink from '@/components/TosLink.vue'

definePage({
  meta: { layout: 'hud' },
})

const { data: userData } = useUserData()
const { data: gifts } = useGifts()
const { data: earnedGifts } = useEarnedGifts()
const { data: jackpot } = useJackpot()

const earnedGiftsIds = computed(() => new Set(earnedGifts.value.map(({ id }) => id)))
const availableGifts = computed(() => gifts.value.filter(({ id }) => !earnedGiftsIds.value.has(id)))
</script>

<template>
  <main class="pt-8 pb-30">
    <Block>
      <BlockTitle class="mb-2.5">
        Полученные призы
      </BlockTitle>

      <Empty
        v-if="earnedGifts.length === 0"
        icon="icon-[linear--gift]"
      >
        Нет полученных призов
      </Empty>
      <template v-else>
        <GiftCard
          v-for="gift in earnedGifts"
          :key="gift.id"
          class="mt-1"
          :gift="gift"
          :current-balance="userData.balance"
        />

        <JackpotCard
          v-if="availableGifts.length === 0"
          class="mt-1"
          :name="jackpot.name"
          :code="userData.promocode"
          participated
        />
      </template>
    </Block>

    <Block>
      <BlockTitle class="mb-2.5">
        Что можно выиграть
      </BlockTitle>

      <Empty
        v-if="availableGifts.length === 0"
        icon="icon-[linear--gift]"
      >
        Нет доступных призов
      </Empty>
      <template v-else>
        <GiftCard
          v-for="gift in availableGifts"
          :key="gift.id"
          class="mt-1"
          :gift="gift"
          :current-balance="userData.balance"
        />

        <JackpotCard
          class="mt-1"
          :name="jackpot.name"
          :code="userData.promocode"
        />
      </template>
    </Block>

    <TosLink class="mt-9 text-center" />
  </main>
</template>
