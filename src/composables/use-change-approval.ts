import type { MaybeRefOrGetter } from 'vue'
import { createEventHook } from '@vueuse/core'
import { shallowRef, toValue, triggerRef, watch } from 'vue'

export type ApproveCallback = () => void

export type KeyExtractor<T, K> = (item: T) => K

export interface UseChangeApprovalOptions {
  autoAdd?: boolean
  autoRemove?: boolean
}

export const useChangeApproval = <T, K>(
  source: MaybeRefOrGetter<T[]>,
  keyExtractor: KeyExtractor<T, K>,
  options: UseChangeApprovalOptions = {},
) => {
  const addedHook = createEventHook<[T, ApproveCallback]>()
  const removedHook = createEventHook<[T, ApproveCallback]>()

  const constructMap = (source: T[]) => new Map(source.map(item => [keyExtractor(item), item]))

  const approved = shallowRef(constructMap(toValue(source)))
  let lastMap = approved.value

  const add = (item: T) => {
    const key = keyExtractor(item)
    if (lastMap.has(key)) {
      approved.value.set(key, item)
      triggerRef(approved)
    }
  }

  const remove = (item: T) => {
    const key = keyExtractor(item)
    if (!lastMap.has(key)) {
      approved.value.delete(key)
      triggerRef(approved)
    }
  }

  watch(() => toValue(source), () => {
    const oldMap = lastMap
    const newMap = constructMap(toValue(source))

    // in order to handle instant approval
    // map must be changed before triggering hooks
    lastMap = newMap

    for (const [key, item] of newMap) {
      if (!oldMap.has(key)) {
        addedHook.trigger(item, () => add(item))
      }
    }

    for (const [key, item] of oldMap) {
      if (!newMap.has(key)) {
        removedHook.trigger(item, () => remove(item))
      }
    }
  })

  if (options.autoAdd) {
    addedHook.on((_, approve) => approve())
  }

  if (options.autoRemove) {
    removedHook.on((_, approve) => approve())
  }

  return {
    approved,
    onAdded: addedHook.on,
    onRemoved: removedHook.on,
  }
}
