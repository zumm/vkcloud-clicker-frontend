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
    class="px-2.5 py-8"
  >
    <i class="mx-auto icon-[linear--cloud] block text-[6.25rem] text-neutral-100" />

    <h1 class="mt-8 text-center text-2xl font-medium text-neutral-100">
      Кликер, который увеличит память телефона
    </h1>

    <p class="mt-5 px-8 text-center text-base font-medium text-neutral-100">
      Кликай и получай
      <span class="font-semibold text-secondary">
        гигабайты памяти
      </span>
      в Облаке Mail
    </p>

    <img
      class="pointer-events-none mx-auto mt-2.5 w-60 select-none"
      src="@/assets/gifts.webp"
      alt="Призы"
    >

    <p class="px-16 text-center text-xl text-neutral-100">
      Участвуй
      <span class="font-semibold text-secondary">
        в розыгрыше 1ТБ
      </span>
      в Облаке на год
    </p>

    <hr class="my-8 border-t border-neutral-100/25">

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
