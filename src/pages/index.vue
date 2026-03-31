<script lang="ts">
import { useActiveBoosters } from '@/loaders/boosters'
import { useEarnedGifts, useGifts, useJackpot } from '@/loaders/gifts'
import { useMilestones } from '@/loaders/milestones'
import { useUserData } from '@/loaders/user-data'

export {
  useActiveBoosters, // for useBoostersStore, Indicators, PhonePerspective
  useEarnedGifts, // for local, useProgressStore, NextGiftCard, PhonePerspective, Indicators
  useGifts, // for useProgressStore, NextGiftCard, PhonePerspective, Indicators
  useJackpot, // for NextGiftCard
  useMilestones, // for Indicators
  useUserData, // for useProgressStore, NextGiftCard, PhonePerspective, Indicators
}
</script>

<script setup lang="ts">
import type { EarnedGiftViewDtoOutput } from '@/api'
import { promiseTimeout, until, whenever } from '@vueuse/core'
import { AnimatePresence } from 'motion-v'
import { storeToRefs } from 'pinia'
import { shallowRef } from 'vue'
import BgTravel from '@/components/BgTravel.vue'
import ClickerArea from '@/components/ClickerArea.vue'
import FirstStepCard from '@/components/FirstStepCard.vue'
import GiftFall from '@/components/GiftFall.vue'
import GiftModal from '@/components/GiftModal.vue'
import Indicators from '@/components/Indicators.vue'
import Overlay from '@/components/kit/Overlay.vue'
import NextGiftCard from '@/components/NextGiftCard.vue'
import PhonePerspective from '@/components/PhonePerspective.vue'
import SlapAnimation from '@/components/SlapAnimation.vue'
import { getLast } from '@/helpers/get-last'
import { useBoostersStore } from '@/stores/boosters'
import { useClickSessionsStore } from '@/stores/click-sessions'
import { useProgressStore } from '@/stores/progress'

definePage({
  meta: { layout: 'hud' },
})

const { giftProgress, balance, nextGift } = storeToRefs(useProgressStore())
const boostersStore = useBoostersStore()
const clickSessionsStore = useClickSessionsStore()

const isIntermission = shallowRef(false)
const isGiftFallAnimationPlaying = shallowRef(false)
const { data: earnedGifts, refetch: refetchEarnedGifts } = useEarnedGifts()
const lastEarnedGift = shallowRef<EarnedGiftViewDtoOutput | undefined>()
whenever(() => giftProgress.value >= 1, async () => {
  if (isIntermission.value) {
    return
  }

  isIntermission.value = true
  isGiftFallAnimationPlaying.value = true
  lastEarnedGift.value = undefined

  const startedAt = Date.now()

  try {
    clickSessionsStore.flush()

    await until(() => clickSessionsStore.totalValue).toBe(0, { flush: 'pre' })

    // await for giftProgress recalculation
    await promiseTimeout(101)
    // misprediction
    if (giftProgress.value < 1) {
      return
    }

    // ensure gift fall animation plays for at least 5s
    await promiseTimeout(5000 - (Date.now() - startedAt))

    // refetching earned gifts after fall animation
    // to delay triggering navigation guards
    await refetchEarnedGifts()

    lastEarnedGift.value = getLast(earnedGifts.value)
  }
  finally {
    isIntermission.value = false
  }
})
</script>

<template>
  <GiftModal
    v-if="lastEarnedGift && nextGift"
    class="z-10000!"
    :gift="lastEarnedGift"
    @close="isGiftFallAnimationPlaying = false"
  />

  <main
    class="
      pointer-events-none flex min-h-dvh touch-none flex-col pt-2.5 select-none
    "
  >
    <BgTravel class="fixed! inset-0 -z-1 mx-auto max-w-md min-w-75" />

    <AnimatePresence>
      <GiftFall
        v-if="isGiftFallAnimationPlaying"
        class="z-999"
      />
    </AnimatePresence>

    <div
      class="
        pointer-events-none absolute top-0 left-0 -z-1 h-50 w-full bg-linear-180
        from-primary
      "
    />

    <NextGiftCard />

    <div class="relative mt-5 grow">
      <Indicators class="relative z-10" />

      <AnimatePresence>
        <template v-if="balance === 0 && nextGift">
          <Overlay class="z-100" />

          <SlapAnimation
            class="
              pointer-events-auto absolute inset-x-0 top-9 z-100 mx-auto
              max-w-fit select-none
            "
          >
            <FirstStepCard :first-gift="nextGift" />
          </SlapAnimation>
        </template>
      </AnimatePresence>

      <div class="absolute top-0 bottom-12 flex w-full justify-center">
        <PhonePerspective class="absolute! inset-0" />

        <ClickerArea
          class="absolute! bottom-23 z-100"
          :click-power="boostersStore.clickPower"
          :class="{
            'pointer-events-auto': !isIntermission,
          }"
          @valid-click="clickSessionsStore.click(boostersStore.clickPower)"
        />
      </div>
    </div>
  </main>
</template>
