import type { MaybeRefOrGetter } from 'vue'
import { createEventHook } from '@vueuse/core'
import { shallowRef, toValue, watch } from 'vue'
import { useMilestones } from '@/loaders/milestones'

interface Milestone {
  id: number
  target: number
  boosterId: number
}

const MILESTONE_EPSILON = Number(import.meta.env.VITE_MILESTONE_EPSILON ?? 250)

const isInReach = (balance: number, target: number) => {
  return balance >= target - MILESTONE_EPSILON && target > balance
}

export const useMilestonesReach = (balance: MaybeRefOrGetter<number>) => {
  const { data: milestones } = useMilestones()

  const inReachHook = createEventHook<Milestone>()
  const reachedHook = createEventHook<Milestone>()

  const getInReach = (balance: number) => {
    return milestones.value.filter(milestone => isInReach(balance, milestone.target))
  }

  const inReach = shallowRef(getInReach(toValue(balance)))

  const getNextInReach = (balance: number) => milestones.value.find(({ target }) => target - MILESTONE_EPSILON > balance)
  const getNext = (balance: number) => milestones.value.find(({ target }) => target > balance)

  const add = (milestone: Milestone) => {
    if (!inReach.value.some(({ id }) => id === milestone.id)) {
      inReach.value = [...inReach.value, milestone]
    }
  }

  const remove = (milestone: Milestone) => {
    inReach.value = inReach.value.filter(({ id }) => id !== milestone.id)
  }

  let nextInReach = getNextInReach(toValue(balance))
  let next = getNext(toValue(balance))

  watch(milestones, () => {
    const balanceValue = toValue(balance)

    nextInReach = getNextInReach(balanceValue)
    next = getNext(balanceValue)

    inReach.value = getInReach(balanceValue)
  })

  watch(() => toValue(balance), (value) => {
    if (nextInReach && value >= nextInReach.target - MILESTONE_EPSILON) {
      inReachHook.trigger(nextInReach)
      nextInReach = getNextInReach(toValue(balance))
    }

    if (next && value >= next.target) {
      reachedHook.trigger(next)
      next = getNext(toValue(balance))
    }
  })

  return {
    onInReach: inReachHook.on,
    onReached: reachedHook.on,
    inReach,
    add,
    remove,
  }
}
