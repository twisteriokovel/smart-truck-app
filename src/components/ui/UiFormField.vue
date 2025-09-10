<template>
  <div class="relative">
    <small v-if="$slots.info" class="block my-1">
      <slot name="info"></slot>
    </small>
    <UiLabel v-if="label">
      <slot></slot>
    </UiLabel>
    <slot v-else />
    <div class="text-left">
      <UiFormFieldErrors
        v-if="errorMessages.length"
        :error-messages="errorMessages"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UiFormFieldErrors from './UiFormFieldErrors.vue'
import UiLabel from './UiLabel.vue'

defineProps({
  id: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  errorMessages: {
    type: Array,
    default: () => [],
  },
})
</script>
