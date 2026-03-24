<script setup lang="ts">
import Button from '@/components/kit/Button.vue'
import Card from '@/components/kit/Card.vue'
import CardTitle from '@/components/kit/CardTitle.vue'

interface Gift {
  name: string
  url?: string
  target: number
}

withDefaults(defineProps<{
  gift: Gift
  detailsMode?: 'legal' | 'short-legal' | 'no-legal'
}>(), {
  detailsMode: 'no-legal',
})
</script>

<template>
  <Card>
    <CardTitle>
      <i class="icon-[linear--gift] text-[1.5rem]" />
      {{ gift.name }}

      <i
        class="ml-auto text-[1.5rem]"
        :class="{
          'icon-[linear--circle]': !gift.url,
          'icon-[bold--tick-circle]': !!gift.url,
        }"
      />
    </CardTitle>

    <template v-if="gift.url">
      <Button
        as="a"
        class="my-2.5 block w-full text-center"
        variant="accent"
        :href="gift.url"
        target="_blank"
      >
        Подключить
        <i class="icon-[linear--share] text-lg" />
      </Button>

      <template v-if="detailsMode === 'no-legal'">
        <p class="text-xs font-medium text-zinc-800">
          Активируй этот подарок сейчас или продолжай играть, чтобы получить больше места в Облаке!
        </p>

        <p class="mt-1 text-xs font-medium text-primary">
          ВНИМАНИЕ: Если ты активируешь этот подарок, то другие станут недоступны, кроме СУПЕРПРИЗА.
        </p>
      </template>
      <template v-else-if="detailsMode === 'short-legal'">
        <p class="text-xs font-medium text-zinc-800">
          Для новых пользователей, ранее не оформлявших подписку «Mail Space».
        </p>
      </template>
      <template v-else>
        <p class="text-xs font-medium text-zinc-800">
          Для новых пользователей и тех, у кого подписка «Mail Space» неактивна более 45 дней.
        </p>

        <p
          class="
            mt-1 text-xs font-medium text-zinc-800/60
            *:text-primary
          "
        >
          Сроки акции: с 16.03.2026 по 27.04.2026.

          Условия:
          <a
            href="https://vk.cc/cU8r4P"
            target="_blank"
          >
            https://vk.cc/cU8r4P
          </a>

          Подробные условия использования безлимитной автозагрузки:

          <a
            href="https://vk.cc/cKeeiP"
            target="_blank"
          >
            https://vk.cc/cKeeiP
          </a>
        </p>
      </template>
    </template>
  </Card>
</template>
