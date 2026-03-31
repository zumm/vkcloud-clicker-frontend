<script setup lang="ts">
import type { DataState } from '@pinia/colada'
import { defineAsyncComponent, onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import CriticalErrorScreen from '@/components/screens/CriticalErrorScreen.vue'
import LoadingScreen from '@/components/screens/LoadingScreen.vue'
import { useNavigationGuards } from '@/composables/navigation-guards'
import { preloadImage } from '@/helpers/preload-image'
import { useGifts, useJackpot } from '@/loaders/gifts'

const COMMON_IMAGES: string[] = Object.values(import.meta.glob(
  [
    '@/assets/**/*.{jpg,jpeg,png,svg,webp}',
    '!@/assets/{icons,bg,feed}',
  ],
  { query: '?url', import: 'default', eager: true },
))

const GAME_IMAGES: string[] = Object.values(import.meta.glob(
  '@/assets/{bg,feed}/*.{png,webp}',
  { query: '?url', import: 'default', eager: true },
))

// TODO: find better place
const { isCampaignOver, isLastGiftEarned } = useNavigationGuards()
const router = useRouter()

const error = shallowRef<unknown>(null)
const progress = shallowRef(0)
const isReady = shallowRef(false)

const appPromise = import('@/App.vue')
const App = defineAsyncComponent(() => appPromise)

const { refresh: refreshGifts } = useGifts()
const { refresh: refreshJackpot } = useJackpot()

const loadOrThrow = async <TData, TError, TDataInitial>(promise: Promise<DataState<TData, TError, TDataInitial>>) => {
  const { data, error } = await promise
  if (error) {
    throw error
  }

  return data
}

onMounted(async () => {
  error.value = null
  progress.value = 0
  isReady.value = false

  const promises: Promise<unknown>[] = []
  let loaded = 0
  // dangling comma is needed to fix eslint parser bug
  // https://github.com/vuejs/eslint-plugin-vue/issues/1343#issuecomment-1891222951
  /* eslint-disable-next-line style/comma-dangle */
  const add = <T,>(promise: Promise<T>): Promise<T> => {
    promises.push(promise.then(() => {
      progress.value = ++loaded / promises.length
    }))

    return promise
  }

  try {
    add(appPromise)
    COMMON_IMAGES.forEach(url => add(preloadImage(url)))

    await add(router.isReady())

    if (!isCampaignOver.value && !isLastGiftEarned.value) {
      GAME_IMAGES.forEach(url => add(preloadImage(url)))
    }

    const [gifts, jackpot] = await Promise.all([
      add(loadOrThrow(refreshGifts())),
      add(loadOrThrow(refreshJackpot())),
    ])

    // it shouldn't be possible, but loaders are buggy af, so extra check is good idea
    if (!gifts || !jackpot) {
      throw new Error('Can not load data from backend')
    }

    for (const { imageUrl } of [...gifts, jackpot]) {
      imageUrl && add(preloadImage(imageUrl))
    }

    await Promise.all(promises)

    isReady.value = true
  }
  catch (exception) {
    console.error(exception)
    error.value = exception

    if (!import.meta.hot) {
      globalThis.stop()
    }
  }
})
</script>

<template>
  <CriticalErrorScreen
    v-if="error"
    :error="error"
  />
  <LoadingScreen v-else-if="!isReady" />
  <App v-else />
</template>
