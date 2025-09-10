<template>
  <UiFormField :label="label" :error-messages="errorMessages">
    <Password
      v-model="password"
      class="w-full"
      :input-props="inputProps"
      input-class="w-full"
      toggle-mask
      :placeholder="placeholder"
      :feedback="false"
      :class="{ 'p-invalid': errorMessages.length, filled: password }"
    />
  </UiFormField>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Password from 'primevue/password'
import UiFormField from './UiFormField.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inputProps: {
    type: Object,
    default: () => ({}),
  },
  errorMessages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const password = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style>
.p-invalid .p-password-input {
  border-color: var(--p-inputtext-invalid-border-color);
}

.p-invalid .p-password-input::placeholder {
  color: var(--p-form-field-invalid-placeholder-color);
}
</style>
