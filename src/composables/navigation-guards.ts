import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEarnedGifts, useGifts } from '@/loaders/gifts'
import { useSettings } from '@/loaders/settings'
import { useAppStore } from '@/stores/app'

// TODO: find better place
export const useNavigationGuards = () => {
  const router = useRouter()
  const appStore = useAppStore()

  const { data: settings, refresh: refreshSettings } = useSettings()
  const { data: gifts, refresh: refreshGifts } = useGifts()
  const { data: earnedGifts, refresh: refreshEarnedGifts } = useEarnedGifts()

  const isCampaignOver = computed(() => settings.value?.campaignState !== 'LIVE')
  const isLastGiftEarned = computed(() => earnedGifts.value?.length >= gifts.value?.length)

  router.beforeEach(async (to) => {
    await Promise.all([
      refreshSettings(),
      refreshGifts(),
      refreshEarnedGifts(),
    ])

    if (isCampaignOver.value) {
      return to.path === '/results' ? undefined : '/results'
    }
    else if (to.path === '/results') {
      return '/'
    }

    if (isLastGiftEarned.value) {
      return to.path === '/wait' ? undefined : '/wait'
    }
    else if (to.path === '/wait') {
      return '/'
    }

    if (!appStore.isOnboardingSeen && to.path !== '/onboarding') {
      return '/onboarding'
    }
  })

  const triggerNavigation = () => {
    router.replace({
      query: {
        ...router.currentRoute.value.query,
        t: Math.random(),
      },
    })
  }

  watch(isCampaignOver, () => triggerNavigation())
  watch(isLastGiftEarned, () => triggerNavigation())
}
