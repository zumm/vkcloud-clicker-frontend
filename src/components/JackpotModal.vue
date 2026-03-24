<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import Button from '@/components/kit/Button.vue'
import Modal from '@/components/kit/Modal.vue'
import { useJackpot } from '@/loaders/gifts'
import { useUserData } from '@/loaders/user-data'
import { useAppStore } from '@/stores/app'

const { isJackpotModalSeen } = storeToRefs(useAppStore())

const { data: userData } = useUserData()
const { data: jackpot } = useJackpot()

const { copy, copied } = useClipboard()
</script>

<template>
  <Modal
    v-if="!isJackpotModalSeen && jackpot && userData?.promocode"
    @close="isJackpotModalSeen = true"
  >
    <h2 class="flex gap-2 text-neutral-100">
      <i class="icon-[linear--gift] text-[1.5rem]" />

      <p class="text-[1.375rem]/tight font-medium">
        Фортуна на твоей стороне!
      </p>
    </h2>

    <p class="mt-4 text-base/tight font-medium text-neutral-100">
      Поздравляем! Ты выиграл
      <span class="font-semibold text-secondary">
        СУПЕРПРИЗ — «{{ jackpot.name }}».
      </span>
      Забери промокод в чат-боте, чтобы активировать награду.
    </p>

    <img
      v-if="jackpot.imageUrl"
      class="pointer-events-none mx-auto my-6 w-60 select-none"
      :src="jackpot.imageUrl"
      :alt="jackpot.name"
    >

    <Button
      class="w-full text-center"
      variant="accent"
      @click="copy(userData.promocode)"
    >
      {{ userData.promocode }}
      <i
        class="text-lg"
        :class="{
          'icon-[linear--copy]': !copied,
          'icon-[linear--tick-circle]': copied,
        }"
      />
    </Button>
  </Modal>
</template>
