<template>
  <div
    class="sticky top-0 z-10 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 shadow-sm"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <i class="pi pi-box text-blue-600"></i>
          <span class="text-sm font-medium text-blue-900">
            {{ t('orders.totalPallets') }}:
          </span>
          <span class="font-bold text-blue-900">
            {{ totalPallets }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-calculator text-blue-600"></i>
          <span class="text-sm font-medium text-blue-900">
            {{ t('orders.totalCargoSize') }}:
          </span>
          <span class="font-bold text-blue-900"> {{ totalWeight }} kg </span>
        </div>
      </div>
      <div v-if="!readonly" class="flex items-center gap-2">
        <Button
          type="button"
          :label="t('orders.addPallet')"
          icon="pi pi-plus"
          size="small"
          @click="$emit('addPallet')"
        />
      </div>
    </div>
    <div v-if="totalPallets > 0" class="mt-2 text-xs text-blue-700">
      {{ t('orders.averageWeight') }}: {{ averageWeight }} kg
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const props = defineProps<{
  totalWeight: number
  totalPallets: number
  readonly?: boolean
}>()

defineEmits<{
  (e: 'addPallet'): void
}>()

const { t } = useI18n()

const averageWeight = computed(() => {
  if (props.totalPallets === 0) return 0
  return Math.round(props.totalWeight / props.totalPallets)
})
</script>
