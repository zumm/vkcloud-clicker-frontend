<script lang="ts">
import { useEarnedGifts, useGifts, useJackpot } from '@/loaders/gifts'
import { useUserData } from '@/loaders/user-data'

// all for local
export {
  useEarnedGifts,
  useGifts,
  useJackpot,
  useUserData,
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import GiftCard from '@/components/GiftCard.vue'
import JackpotCard from '@/components/JackpotCard.vue'
import Block from '@/components/kit/Block.vue'
import BlockTitle from '@/components/kit/BlockTitle.vue'
import Empty from '@/components/kit/Empty.vue'
import TosLink from '@/components/TosLink.vue'
import { getLast } from '@/helpers/get-last'

definePage({
  meta: { layout: 'hud' },
})

const { data: userData } = useUserData()
const { data: gifts } = useGifts()
const { data: earnedGifts } = useEarnedGifts()
const { data: jackpot } = useJackpot()

const bestGift = computed(() => getLast(earnedGifts.value))

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
        v-if="!bestGift"
        icon="icon-[linear--gift]"
      >
        Нет полученных призов
      </Empty>
      <template v-else>
        <GiftCard
          :key="bestGift.id"
          class="mt-1"
          :gift="bestGift"
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
