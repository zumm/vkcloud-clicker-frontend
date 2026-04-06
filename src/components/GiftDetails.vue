<script setup lang="ts">
import type { GiftViewDtoOutput } from '@/api'

type LegalTextVariant = GiftViewDtoOutput['legalTextVariant'] | 'NO'

withDefaults(defineProps<{
  variant?: LegalTextVariant
  onPrimary?: boolean
}>(), {
  variant: 'NO',
})
</script>

<template>
  <section
    class="text-xs font-medium"
    :class="{
      'text-zinc-800': !onPrimary,
      'text-neutral-100': onPrimary,
    }"
  >
    <template v-if="variant === 'NO'">
      <p>
        Активируй этот подарок сейчас или продолжай играть, чтобы получить больше места в Облаке!
      </p>

      <p
        class="mt-1"
        :class="{
          'text-primary': !onPrimary,
          'text-secondary': onPrimary,
        }"
      >
        ВНИМАНИЕ: Если ты активируешь этот подарок, то другие станут недоступны, кроме СУПЕРПРИЗА.
      </p>
    </template>
    <template v-else-if="variant === 'SHORT'">
      <p>
        Для новых пользователей, ранее не оформлявших подписку «Mail Space».
      </p>
    </template>
    <template v-else>
      <p>
        Акция: с 16.03.2026 по 27.04.2026.

        Условия:
        <a
          href="https://vk.cc/cU8r4P"
          target="_blank"
          :class="{
            'text-primary': !onPrimary,
            'text-secondary': onPrimary,
          }"
        >
          https://vk.cc/cU8r4P
        </a>
      </p>

      <p>
        Для новых пользователей и тех, у кого подписка «Mail Space» неактивна более 45 дней.
      </p>
    </template>
  </section>
</template>
