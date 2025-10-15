<template>
  <div
    class="pallet-item bg-white border border-gray-200 rounded-lg transition-shadow"
    :class="[
      sizeClass,
      noDraggable
        ? 'cursor-default hover:shadow-none'
        : 'cursor-move hover:shadow-md ',
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <i class="pi pi-grip-vertical text-gray-400 mr-2"></i>
        <div>
          <div class="font-medium" :class="titleSizeClass">
            {{ t('trips.pallet') }} #{{ palletId.slice(-6) }}
          </div>
          <div class="text-xs text-gray-500">
            {{ pallet?.weight }}kg • {{ pallet?.height }}cm
          </div>
        </div>
      </div>
      <div class="text-right">
        <div
          class="rounded border"
          :class="[statusIndicatorClass, statusColorClass]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IPallet } from '@/types/orders'

interface Props {
  palletId: string
  pallet: IPallet | undefined
  size?: 'small' | 'normal'
  status?: 'unassigned' | 'assigned'
  noDraggable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  status: 'unassigned',
})

const { t } = useI18n()

const sizeClass = computed(() => {
  return props.size === 'small' ? 'p-2' : 'p-3'
})

const titleSizeClass = computed(() => {
  return props.size === 'small' ? 'text-xs' : 'text-sm'
})

const statusIndicatorClass = computed(() => {
  return props.size === 'small' ? 'w-3 h-3' : 'w-4 h-4'
})

const statusColorClass = computed(() => {
  return props.status === 'assigned'
    ? 'bg-green-100 border-green-300'
    : 'bg-blue-100 border-blue-300'
})
</script>

<style scoped>
.pallet-item {
  transition: all 0.2s ease;
}
</style>
