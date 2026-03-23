<script lang="ts">
import { useActiveBoosters } from '@/loaders/boosters'
import { useEarnedGifts, useGifts } from '@/loaders/gifts'
import { useMilestones } from '@/loaders/milestones'
import { useUserData } from '@/loaders/user-data'

export { useActiveBoosters, useEarnedGifts, useGifts, useMilestones, useUserData }
</script>

<script setup lang="ts">
import type { EarnedGiftViewDtoOutput } from '@/api'
import { until, whenever } from '@vueuse/core'
import { Motion } from 'motion-v'
import { storeToRefs } from 'pinia'
import { shallowRef, useTemplateRef } from 'vue'
import BgTravel from '@/components/BgTravel.vue'
import BoosterIndicator from '@/components/BoosterIndicator.vue'
import ClickerArea from '@/components/ClickerArea.vue'
import FirstStepPopup from '@/components/FirstStepPopup.vue'
import GiftModal from '@/components/GiftModal.vue'
import MilestoneIndicator from '@/components/MilestoneIndicator.vue'
import NextGiftCard from '@/components/NextGiftCard.vue'
import NotificationQueue from '@/components/NotificationQueue.vue'
import PhonePerspective from '@/components/PhonePerspective.vue'
import Stack from '@/components/Stack.vue'
import { useMilestonesReach } from '@/composables/milestones-reach'
import { getLast } from '@/helpers/get-last'
import { useBoostersStore } from '@/stores/boosters'
import { useClickSessionsStore } from '@/stores/click-sessions'
import { useProgressStore } from '@/stores/progress'

definePage({
  meta: { layout: 'hud' },
})

const { progress, balance, nextGift } = storeToRefs(useProgressStore())
const boostersStore = useBoostersStore()
const clickSessionsStore = useClickSessionsStore()

const isIntermission = shallowRef(false)
const { data: earnedGifts, refetch: refetchEarnedGifts } = useEarnedGifts()
const lastEarnedGift = shallowRef<EarnedGiftViewDtoOutput | undefined>()
whenever(() => progress.value >= 1, async () => {
  if (isIntermission.value) {
    return
  }

  isIntermission.value = true
  lastEarnedGift.value = undefined

  try {
    clickSessionsStore.flush()

    await until(() => clickSessionsStore.totalValue).toBe(0, { flush: 'pre' })
    await refetchEarnedGifts()

    lastEarnedGift.value = getLast(earnedGifts.value)
  }
  finally {
    isIntermission.value = false
  }
})

const queueRef = useTemplateRef('queueRef')

boostersStore.onNewBooster((booster) => {
  queueRef.value?.push({
    id: `booster-${booster.userBoosterId}`,
    durationMs: 2000,
    component: BoosterIndicator,
    props: { booster },
  })
})

const { inReach, onInReach, onReached, add, remove } = useMilestonesReach(balance)
const reachedMilestonesIds = new Set<number>()

onInReach((milestone) => {
  const id = `milestone-${milestone.id}`
  queueRef.value?.push({
    id,
    durationMs: 2000,
    component: MilestoneIndicator,
    props: { milestone },
    slapProps: { layoutId: id, initial: { scale: 1.3 } },
    onComplete: () => {
      !reachedMilestonesIds.has(milestone.id) && add(milestone)
    },
  })
})

onReached((milestone) => {
  clickSessionsStore.flush()
  reachedMilestonesIds.add(milestone.id)
  remove(milestone)
})
</script>

<template>
  <GiftModal
    v-if="lastEarnedGift && nextGift"
    class="z-10000!"
    :gift="lastEarnedGift"
  />

  <main class="pointer-events-none flex min-h-dvh flex-col pt-2.5 select-none">
    <BgTravel class="fixed! inset-0 -z-1 mx-auto max-w-md min-w-75" />

    <NextGiftCard />

    <hr class="mt-5 mb-2.5 border-t-2 border-dashed border-primary-lightest/40">

    <div class="relative grow">
      <Stack
        class="relative z-9"
        :items="inReach"
      >
        <template #default="{ item: milestone }">
          <Motion
            :key="milestone.id"
            :layout-id="`milestone-${milestone.id}`"
            as-child
            :initial="{ opacity: 0.5, scale: 0.9 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.9 }"
          >
            <MilestoneIndicator :milestone="milestone" />
          </Motion>
        </template>
      </Stack>

      <NotificationQueue
        ref="queueRef"
        class="absolute top-15 z-10 w-full"
      />

      <FirstStepPopup
        class="
          pointer-events-auto absolute inset-x-0 top-9 z-11 mx-auto max-w-fit
          select-none
        "
      />

      <div class="absolute top-0 bottom-12 flex w-full justify-center">
        <PhonePerspective class="absolute! inset-0" />

        <ClickerArea
          class="absolute! bottom-23"
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
