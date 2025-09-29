<template>
  <UiFormField
    :id="uniqId"
    :label="label"
    :error-messages="errorMessages"
    :horizontal="horizontal"
  >
    <component
      v-bind="componentAttrs"
      :is="component"
      :id="uniqId"
      :class="{
        'p-invalid': errorMessages.length,
        filled: componentAttrs.modelValue,
      }"
      :auto-resize="true"
      cols="30"
      :placeholder="placeholder"
      class="w-full"
    />
  </UiFormField>
</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import uniqueId from 'lodash/uniqueId'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import UiFormField from './UiFormField.vue'

const uniqId = uniqueId('input_id_')
const attrs = useAttrs()

const props = defineProps({
  multiline: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  errorMessages: {
    type: Array,
    default: () => [],
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
})

const component = computed(() => {
  return props.multiline ? Textarea : InputText
})

const componentAttrs = computed(() => {
  const attributes: Record<string, unknown> = {}
  for (const attr in attrs) {
    if (attr !== 'class') {
      attributes[attr] = attrs[attr]
    }
  }
  return attributes
})
</script>
