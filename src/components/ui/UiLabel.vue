<template>
  <label v-if="$slots.default || label" v-bind="$attrs">
    <slot>
      {{ label }}
    </slot>
  </label>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
})
</script>
