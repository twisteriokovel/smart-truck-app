<template>
  <label
    v-if="$slots.default || label"
    v-bind="$attrs"
    :class="horizontal ? 'flex items-center gap-2' : 'block'"
  >
    <span
      :class="
        horizontal
          ? 'text-sm font-medium text-gray-700 whitespace-nowrap'
          : 'inline-block text-sm font-medium text-gray-700 mb-1'
      "
    >
      {{ label }}
    </span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
})
</script>
