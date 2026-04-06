<script setup lang="ts">
import type { EarnedGiftViewDtoOutput, GiftViewDtoOutput } from '@/api'
import { computed } from 'vue'
import GiftDetails from '@/components/GiftDetails.vue'
import Button from '@/components/kit/Button.vue'
import Card from '@/components/kit/Card.vue'
import CardTitle from '@/components/kit/CardTitle.vue'

type Gift = GiftViewDtoOutput | EarnedGiftViewDtoOutput

const props = defineProps<{
  gift: Gift
  noLegalText?: boolean
}>()

const legalTextVariant = computed(() => props.noLegalText ? 'NO' : props.gift.legalTextVariant)
</script>

<template>
  <Card>
    <CardTitle>
      <i class="icon-[linear--gift] text-[1.5rem]" />
      {{ gift.name }}

      <i
        class="ml-auto text-[1.5rem]"
        :class="{
          'icon-[linear--circle]': !('url' in gift),
          'icon-[bold--tick-circle]': 'url' in gift,
        }"
      />
    </CardTitle>

    <template v-if="'url' in gift">
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

      <GiftDetails :variant="legalTextVariant" />
    </template>
  </Card>
</template>
