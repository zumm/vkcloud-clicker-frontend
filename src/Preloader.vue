<script setup lang="ts">
import { defineAsyncComponent, onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import CriticalErrorScreen from '@/components/screens/CriticalErrorScreen.vue'
import LoadingScreen from '@/components/screens/LoadingScreen.vue'
// import { useEarnedGifts, useGifts, useJackpot } from '@/loaders/gifts'
// import { useSettings } from '@/loaders/settings'
import { useNavigationGuards } from '@/composables/navigation-guards'
import { preloadImage } from '@/helpers/preload-image'

const COMMON_IMAGES: string[] = Object.values(import.meta.glob(
  [
    '@/assets/**/*.{jpg,jpeg,png,svg,webp}',
    '!@/assets/{icons,bg,feed}',
  ],
  { query: '?url', import: 'default', eager: true },
))

const GAME_IMAGES: string[] = Object.values(import.meta.glob(
  '@/assets/{bg,feed}/*.webp',
  { query: '?url', import: 'default', eager: true },
))

// TODO: find better place
useNavigationGuards()
const router = useRouter()

const error = shallowRef<unknown>(null)
const progress = shallowRef(0)
const isReady = shallowRef(false)

const appPromise = import('@/App.vue')
const App = defineAsyncComponent(() => appPromise)

// we can't just await loader itself since errors are suppressed
// const { refresh: refreshSettings } = useSettings()
// const { refresh: refreshGifts } = useGifts()
// const { refresh: refreshEarnedGifts } = useEarnedGifts()
// const { refresh: refreshJackpot } = useJackpot()

// const loadOrThrow = async <TData, TError, TDataInitial>(promise: Promise<DataState<TData, TError, TDataInitial>>) => {
//   const { data, error } = await promise
//   if (error) {
//     throw error
//   }

//   return data
// }

onMounted(async () => {
  error.value = null
  progress.value = 0
  isReady.value = false

  const promises: Promise<unknown>[] = []
  let loaded = 0
  const add = (promise: Promise<unknown>) => {
    promises.push(promise.then(() => {
      progress.value = ++loaded / promises.length
    }))
  }

  try {
    // const dataPromises = [
    //   loadOrThrow(refreshSettings()),
    //   loadOrThrow(refreshGifts()),
    //   loadOrThrow(refreshEarnedGifts()),
    //   loadOrThrow(refreshJackpot()),
    // ] as const

    add(router.isReady())
    add(appPromise)
    // dataPromises.forEach(add)
    COMMON_IMAGES.forEach(url => add(preloadImage(url)))
    GAME_IMAGES.forEach(url => add(preloadImage(url)))

    // const [settings, gifts, earnedGifts, jackpot] = await Promise.all(dataPromises)

    // for (const { imageUrl } of [...gifts, jackpot]) {
    //   imageUrl && add(preloadImage(imageUrl))
    // }

    // const isCampaignOver = settings.campaignState !== 'LIVE'
    // const isLastGiftEarned = earnedGifts.length >= gifts.length
    // if (!isCampaignOver && !isLastGiftEarned) {
    //   GAME_IMAGES.forEach(url => add(preloadImage(url)))
    // }

    await Promise.all(promises)

    isReady.value = true
  }
  catch (exception) {
    console.error(exception)
    error.value = exception
    globalThis.stop()
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
