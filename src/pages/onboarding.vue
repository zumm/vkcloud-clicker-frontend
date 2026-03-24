<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import Button from '@/components/kit/Button.vue'
import Container from '@/components/kit/Container.vue'
import TosLink from '@/components/TosLink.vue'
import { useAppStore } from '@/stores/app'

const { isOnboardingSeen } = storeToRefs(useAppStore())
</script>

<template>
  <Container
    as="main"
    class="px-2.5 py-4"
  >
    <i class="mx-auto icon-[linear--cloud] block text-[6.25rem] text-neutral-100" />

    <h1 class="mt-2 text-center text-2xl font-medium text-neutral-100">
      Кликер, который увеличит
      <br>
      память телефона
    </h1>

    <p class="mt-5 text-center text-xl font-medium text-neutral-100">
      Кликай и получай
      <span class="font-semibold text-secondary">
        гигабайты
        <br>
        памяти
      </span>
      в Облаке Mail
    </p>

    <img
      class="pointer-events-none mx-auto mt-2.5 w-50 shrink select-none"
      src="@/assets/gifts.webp"
      alt="Призы"
    >

    <p class="text-center text-xl text-neutral-100">
      Пройди все уровни и участвуй
      <br>
      в розыгрыше
      <span class="font-semibold text-secondary">
        1 ТБ в Облаке на год
      </span>
    </p>

    <hr class="my-4 border-t border-neutral-100/25">

    <RouterLink
      v-slot="{ navigate }"
      to="/"
      custom
    >
      <Button
        class="w-full text-center"
        variance="accent"
        @click="(isOnboardingSeen = true) && navigate()"
      >
        Начать игру
        <i class="icon-[linear--flash] text-lg" />
      </Button>
    </RouterLink>

    <TosLink class="mt-2.5 text-center" />
  </Container>
</template>
