<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import JackpotBadge from '@/components/JackpotBadge.vue'
import Button from '@/components/kit/Button.vue'
import Card from '@/components/kit/Card.vue'
import CardTitle from '@/components/kit/CardTitle.vue'

defineProps<{
  name: string
  code: string | null
  participated?: boolean
}>()

const { copy, copied } = useClipboard()
</script>

<template>
  <Card>
    <CardTitle class="mb-2.5">
      <i class="icon-[linear--gift] text-[1.5rem]" />
      {{ name }}

      <JackpotBadge
        class="ml-1"
        variant="secondary"
      />

      <i
        class="ml-auto text-[1.5rem]"
        :class="{
          'icon-[linear--circle]': !participated,
          'icon-[bold--tick-circle]': participated,
        }"
      />
    </CardTitle>

    <template v-if="code">
      <Button
        class="w-full text-center"
        variant="accent"
        @click="copy(code)"
      >
        {{ code }}
        <i
          class="text-lg"
          :class="{
            'icon-[linear--copy]': !copied,
            'icon-[linear--tick-circle]': copied,
          }"
        />
      </Button>
    </template>
    <template v-else>
      <p class="text-xs font-medium text-zinc-800">
        Накликай <b>1 ТБ</b> и участвуй в <b>розыгрыше суперприза</b>
      </p>
    </template>
  </Card>
</template>
