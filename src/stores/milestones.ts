import { defineStore, storeToRefs } from 'pinia'
import { shallowRef, watch } from 'vue'
import { MILESTONE_EPSILON } from '@/env'
import { useMilestones } from '@/loaders/milestones'
import { useClickSessionsStore } from '@/stores/click-sessions'
import { useProgressStore } from '@/stores/progress'

const isInReach = (balance: number, target: number) => {
  return balance >= target - MILESTONE_EPSILON && target > balance
}

export const useMilestonesStore = defineStore('milestones', () => {
  const { flush } = useClickSessionsStore()
  const { balance } = storeToRefs(useProgressStore())

  const { data: milestones } = useMilestones()

  const getInReach = (balance: number) => {
    return milestones.value.filter(milestone => isInReach(balance, milestone.target))
  }

  const inReach = shallowRef(getInReach(balance.value))

  const getNextInReach = (balance: number) => milestones.value.find(({ target }) => target - MILESTONE_EPSILON > balance)
  const getNext = (balance: number) => milestones.value.find(({ target }) => target > balance)

  let nextInReach = getNextInReach(balance.value)
  let next = getNext(balance.value)

  watch(milestones, () => {
    nextInReach = getNextInReach(balance.value)
    next = getNext(balance.value)

    inReach.value = getInReach(balance.value)
  })

  watch(balance, () => {
    let isChanged = false

    if (nextInReach && balance.value >= nextInReach.target - MILESTONE_EPSILON) {
      nextInReach = getNextInReach(balance.value)
      isChanged = true
    }

    if (next && balance.value >= next.target) {
      flush()
      next = getNext(balance.value)
      isChanged = true
    }

    if (isChanged) {
      inReach.value = getInReach(balance.value)
    }
  })

  return {
    inReachMilestones: inReach,
  }
})
