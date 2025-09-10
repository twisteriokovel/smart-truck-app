<template>
  <small v-if="!errorMessages.length">&nbsp;</small>
  <small
    v-for="(error, index) in errorMessages"
    v-else
    :key="index"
    class="text-xs text-red-500"
  >
    {{ error }}
  </small>
</template>

<script setup lang="ts">
defineProps({
  errorMessages: {
    type: Array,
    default: () => [],
  },
})
</script>
