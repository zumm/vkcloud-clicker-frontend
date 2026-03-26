import type { Serializer } from '@vueuse/core'
import { tryOnScopeDispose, useArrayReduce, useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import {
  CLICK_SESSION_MAX_DURATION,
  CLICK_SESSION_MAX_SIZE,
  CLICK_SESSION_MIN_DURATION,
} from '@/env'

interface ClickSession {
  totalClicks: number
  estimatedValue: number
  startedAt?: Date
  endedAt?: Date
}

type PackedClickSession = [number, number] | [number, number, number] | [number, number, number, number]

interface Packer<I, O> {
  pack: (unpacked: I) => O
  unpack: (packed: O) => I
}

const packer: Packer<ClickSession, PackedClickSession> = {
  pack: ({ totalClicks, estimatedValue, startedAt, endedAt }) => {
    return [
      totalClicks,
      estimatedValue,
      startedAt && startedAt.valueOf(),
      endedAt && endedAt.valueOf(),
    ].filter(item => item != null) as PackedClickSession
  },
  unpack: ([totalClicks, estimatedValue, startedAt, endedAt]) => {
    return {
      totalClicks,
      estimatedValue,
      startedAt: startedAt != null ? new Date(startedAt) : undefined,
      endedAt: endedAt != null ? new Date(endedAt) : undefined,
    }
  },
}

const serializerOne: Serializer<ClickSession> = {
  write: value => JSON.stringify(packer.pack(value)),
  read: raw => packer.unpack(JSON.parse(raw)),
}

const serializerMany: Serializer<ClickSession[]> = {
  write: value => JSON.stringify(value.map(packer.pack)),
  read: raw => JSON.parse(raw).map(packer.unpack),
}

export const useClickSessionsStore = defineStore('clickSessions', () => {
  const sealed = useLocalStorage('clickSessions', [], { serializer: serializerMany })
  const session = useLocalStorage(
    'clickSession',
    { totalClicks: 0, estimatedValue: 0 },
    { mergeDefaults: true, serializer: serializerOne },
  )

  const sealedValue = useArrayReduce(sealed, (total, session) => total + session.estimatedValue, 0)
  const totalValue = computed(() => sealedValue.value + session.value.estimatedValue)

  let flushTimerId: number | undefined
  tryOnScopeDispose(() => clearTimeout(flushTimerId))

  function flush() {
    if (
      session.value.totalClicks === 0
      // actually can't be, just type guard
      || session.value.endedAt == null
      || session.value.startedAt == null
    ) {
      clearTimeout(flushTimerId)
      return
    }

    const startedAtValue = session.value.startedAt.valueOf()

    const durationMs = session.value.endedAt.valueOf() - startedAtValue
    if (CLICK_SESSION_MIN_DURATION > durationMs) {
      const endedAtValue = startedAtValue + CLICK_SESSION_MIN_DURATION
      const nowValue = Date.now()

      if (endedAtValue > nowValue) {
        clearTimeout(flushTimerId)
        flushTimerId = setTimeout(flush, endedAtValue - nowValue + 1)
        return
      }

      session.value.endedAt = new Date(endedAtValue)
    }

    sealed.value.push({ ...session.value })
    // fixme: sometimes localStorage doesn't update
    session.value = { totalClicks: 0, estimatedValue: 0 }

    clearTimeout(flushTimerId)
  }

  function click(estimatedValue: number = 1) {
    const now = new Date()

    session.value.endedAt = now
    session.value.totalClicks += 1
    session.value.estimatedValue += estimatedValue

    if (!session.value.startedAt) {
      session.value.startedAt = now
      flushTimerId = setTimeout(flush, CLICK_SESSION_MAX_DURATION)
    }
    else if (session.value.totalClicks >= CLICK_SESSION_MAX_SIZE) {
      flush()
    }
  }

  flush()

  return {
    sealed,
    session,
    sealedValue,
    totalValue,
    flush,
    click,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClickSessionsStore, import.meta.hot))
}
