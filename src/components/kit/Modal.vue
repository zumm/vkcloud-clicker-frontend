<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits<{
  close: []
}>()

const model = defineModel<boolean>({ default: true })
const close = () => {
  model.value = false
  emit('close')
}
</script>

<template>
  <VueFinalModal
    v-model="model"
    class="relative flex items-center justify-center"
    overlay-class="bg-zinc-800/45 backdrop-blur-xs"
    content-class="max-h-full w-full max-w-md min-w-75 overflow-auto p-2.5"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    overlay-behavior="persist"
    :click-to-close="false"
    :esc-to-close="false"
  >
    <div class="relative mt-12 w-full rounded-[0.625rem] bg-primary p-5">
      <button
        class="
          absolute -top-12 right-0 cursor-pointer bg-transparent
          text-neutral-100
        "
        @click="close"
      >
        <i class="icon-[linear--close-circle] text-[2rem]" />
      </button>

      <slot v-bind="{ close }" />
    </div>
  </VueFinalModal>
</template>
