<script setup lang="ts">
import type { EarnedGiftViewDtoOutput, GiftViewDtoOutput } from '@/api'
import GiftDetails from '@/components/GiftDetails.vue'
import Button from '@/components/kit/Button.vue'
import Modal from '@/components/kit/Modal.vue'

type Gift = GiftViewDtoOutput | EarnedGiftViewDtoOutput

defineProps<{
  gift: Gift
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Modal
    v-slot="{ close }"
    @close="$emit('close')"
  >
    <h2 class="flex gap-2 text-neutral-100">
      <i class="icon-[linear--gift] text-[1.5rem]" />

      <p class="text-[1.375rem]/tight font-medium">
        Ты накликал
        <span class="font-semibold text-secondary">
          {{ gift.name }}
        </span>
        в&nbsp;Облаке Mail
      </p>
    </h2>

    <img
      v-if="gift.imageUrl"
      class="pointer-events-none mx-auto my-6 w-60 select-none"
      :src="gift.imageUrl"
      :alt="gift.name"
    >

    <p class="mt-4 text-base/tight font-medium text-neutral-100">
      Продолжай играть, чтобы получить больше памяти, а подарок можно активировать в разделе
      <span class="font-semibold text-secondary">
        «Призы»
      </span>
    </p>

    <Button
      class="mt-4 mb-2 w-full text-center"
      variant="accent"
      @click="close"
    >
      Продолжить игру
    </Button>

    <GiftDetails
      :variant="gift.legalTextVariant"
      on-primary
    />
  </Modal>
</template>
