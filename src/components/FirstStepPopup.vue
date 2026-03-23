<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Button from '@/components/kit/Button.vue'
import SlapAnimation from '@/components/SlapAnimation.vue'
import { useEarnedGifts, useGifts } from '@/loaders/gifts'
import { useAppStore } from '@/stores/app'

defineOptions({
  inheritAttrs: false,
})

const { isFirstStepPopupSeen } = storeToRefs(useAppStore())

const { data: gifts } = useGifts()
const { data: earnedGifts } = useEarnedGifts()

const firstGift = computed(() => gifts.value[0])

const close = () => {
  isFirstStepPopupSeen.value = true
}
</script>

<template>
  <AnimatePresence>
    <SlapAnimation
      v-if="!isFirstStepPopupSeen && earnedGifts.length === 0"
      v-bind="$attrs"
    >
      <section class="rounded-lg bg-neutral-100 p-2.5">
        <p class="text-sm font-medium text-zinc-800">
          Начинай кликать на первый приз:
        </p>

        <p class="mb-1 text-center text-base font-medium text-primary">
          {{ firstGift?.name }}!
        </p>

        <Button
          class="w-full text-center"
          variance="accent"
          @click="close"
        >
          Погнали!
          <i class="icon-[linear--flash] text-base" />
        </Button>
      </section>
    </SlapAnimation>
  </AnimatePresence>
</template>
