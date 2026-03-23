import { defineColadaLoader } from 'vue-router/experimental/pinia-colada'
import { getMilestones } from '@/api'

export const milestonesKey = ['milestones']

export const useMilestones = defineColadaLoader({
  async query(_, { signal }) {
    const { items } = await getMilestones({ signal })
    return items
  },
  key: milestonesKey,
  staleTime: Infinity,
})
