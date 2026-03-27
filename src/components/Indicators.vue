<script setup lang="ts">
import { Motion } from 'motion-v'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import BoosterIndicator from '@/components/BoosterIndicator.vue'
import MilestoneIndicator from '@/components/MilestoneIndicator.vue'
import Stack from '@/components/Stack.vue'
import { useBoostersStore } from '@/stores/boosters'
import { useMilestonesStore } from '@/stores/milestones'

const { inReachMilestones } = storeToRefs(useMilestonesStore())
const { sortedBoosters } = storeToRefs(useBoostersStore())

const getMilestoneKey = (milestone: { id: number }) => `milestone-${milestone.id}`
const getBoosterKey = (booster: { userBoosterId: number }) => `booster-${booster.userBoosterId}`

const stackItems = computed(() => [
  ...inReachMilestones.value.map(milestone => ({
    key: getMilestoneKey(milestone),
    component: MilestoneIndicator,
    props: { milestone },
  })),
  ...sortedBoosters.value.map(booster => ({
    key: getBoosterKey(booster),
    component: BoosterIndicator,
    props: { booster },
  })),
])
</script>

<template>
  <Stack
    :items="stackItems"
    class="items-start"
  >
    <template #default="{ item }">
      <Motion
        :key="item.key"
        as-child
        :initial="{ opacity: 0.5, scale: 0.9 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.9 }"
      >
        <component
          :is="item.component"
          v-bind="item.props"
        />
      </Motion>
    </template>
  </Stack>
</template>
