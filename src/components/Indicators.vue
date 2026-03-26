<script setup lang="ts">
import { Motion } from 'motion-v'
import { storeToRefs } from 'pinia'
import { computed, useTemplateRef } from 'vue'
import BoosterIndicator from '@/components/BoosterIndicator.vue'
import MilestoneIndicator from '@/components/MilestoneIndicator.vue'
import NotificationQueue from '@/components/NotificationQueue.vue'
import Stack from '@/components/Stack.vue'
import { useChangeApproval } from '@/composables/use-change-approval'
import { useBoostersStore } from '@/stores/boosters'
import { useMilestonesStore } from '@/stores/milestones'

const { inReachMilestones } = storeToRefs(useMilestonesStore())
const { sortedBoosters } = storeToRefs(useBoostersStore())

const queueRef = useTemplateRef('queueRef')

const getMilestoneKey = (milestone: { id: number }) => `milestone-${milestone.id}`
const getBoosterKey = (booster: { userBoosterId: number }) => `booster-${booster.userBoosterId}`

const { approved: milestones, onAdded: onInReach } = useChangeApproval(
  inReachMilestones,
  getMilestoneKey,
  { autoRemove: true },
)

onInReach((milestone, approve) => {
  const key = getMilestoneKey(milestone)
  queueRef.value?.push({
    id: key,
    durationMs: 2000,
    component: MilestoneIndicator,
    props: { milestone },
    slapProps: { layoutId: key, initial: { scale: 1.3 } },
    onComplete: approve,
  })
})

const { approved: boosters, onAdded: onNewBooster } = useChangeApproval(
  sortedBoosters,
  getBoosterKey,
  { autoRemove: true },
)

onNewBooster((booster, approve) => {
  const key = getBoosterKey(booster)
  queueRef.value?.push({
    id: key,
    durationMs: 2000,
    component: BoosterIndicator,
    props: { booster },
    slapProps: { layoutId: key, initial: { scale: 1.3 } },
    onComplete: approve,
  })
})

const stackItems = computed(() => [
  ...[...milestones.value.entries()].map(([key, milestone]) => ({
    key,
    component: MilestoneIndicator,
    props: { milestone },
  })),
  ...[...boosters.value.entries()].map(([key, booster]) => ({
    key,
    component: BoosterIndicator,
    props: { booster },
  })),
])
</script>

<template>
  <div class="relative">
    <Stack :items="stackItems">
      <template #default="{ item }">
        <Motion
          :key="item.key"
          :layout-id="item.key"
          as-child
          :initial="{ opacity: 0.5, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.9, transition: { delay: 0.3 } }"
        >
          <component
            :is="item.component"
            v-bind="item.props"
          />
        </Motion>
      </template>
    </Stack>

    <NotificationQueue
      ref="queueRef"
      class="absolute top-15 w-full"
    />
  </div>
</template>
