<template>
  <div :class="containerClasses">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <i class="pi pi-truck text-blue-600 mr-2"></i>
        <div>
          <h5 class="font-medium text-gray-900">
            {{ trip.truck.plateNumber }}
          </h5>
          <p class="text-sm text-gray-600">
            {{ formatDateTime(trip.startDate) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <TripActions :trip="trip" disabled-status-buttons />
      </div>
    </div>

    <div class="mb-3">
      <div class="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span class="text-gray-600">{{ t('trips.pallets') }}:</span>
          <span
            class="ml-1 font-medium"
            :class="{ 'text-red-600': isPalletsOverloaded }"
          >
            {{ trip.palletIds.length }}
            {{ trip.truck ? `/${trip.truck.maxPallets}` : '' }}
          </span>
        </div>
        <div>
          <span class="text-gray-600">{{ t('trips.weight') }}:</span>
          <span
            class="ml-1 font-medium"
            :class="{ 'text-red-600': isWeightOverloaded }"
          >
            {{ tripWeight }}
            {{ trip.truck ? `/${trip.truck.maxWeight}` : '' }} kg
          </span>
        </div>
      </div>
    </div>

    <draggable
      :list="trip.palletIds"
      :item-key="(item: string) => item"
      :animation="200"
      :group="canDragPallets ? 'pallets' : 'disabled'"
      :disabled="!canDragPallets"
      class="min-h-20 space-y-2"
      :class="{ 'opacity-60 cursor-not-allowed': !canDragPallets }"
      ghost-class="ghost-pallet"
    >
      <template #item="{ element: palletId }">
        <DraggablePalletItem
          :pallet-id="palletId"
          :pallet="getPalletById(palletId)"
          size="small"
          status="assigned"
        />
      </template>
    </draggable>

    <div
      v-if="trip.palletIds.length === 0"
      class="text-center py-4 text-gray-500"
    >
      <i class="pi pi-plus-circle text-xl mb-1"></i>
      <p class="text-sm">{{ t('trips.dropPalletsHere') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import DraggablePalletItem from './DraggablePalletItem.vue'
import TripActions from './TripActions.vue'
import { useDateFormat } from '@/composables/useDateFormat'
import type { IOrderTrip } from '@/types/trips'
import { TripStatus } from '@/types/trips'
import type { IPallet } from '@/types/orders'

interface Props {
  trip: IOrderTrip
  pallets: IPallet[]
  canEdit?: boolean
}

const props = defineProps<Props>()

const { t } = useI18n()
const { formatDateTime } = useDateFormat()

function getPalletById(palletId: string): IPallet | undefined {
  return props.pallets.find((p) => p.id === palletId)
}

const tripWeight = computed(() => {
  return props.trip.palletIds.reduce((total, id) => {
    const pallet = getPalletById(id)
    return total + (pallet?.weight || 0)
  }, 0)
})

const canDragPallets = computed(() => {
  const restrictedStatuses = [
    TripStatus.IN_PROGRESS,
    TripStatus.DONE,
    TripStatus.CANCELLED,
  ]
  return (
    props.canEdit !== false && !restrictedStatuses.includes(props.trip.status)
  )
})

const isPalletsOverloaded = computed(() => {
  if (!props.trip.truck.maxPallets) return false
  return props.trip.palletIds.length > props.trip.truck.maxPallets
})

const isWeightOverloaded = computed(() => {
  if (!props.trip.truck.maxWeight) return false
  const maxWeight =
    typeof props.trip.truck.maxWeight === 'string'
      ? parseFloat(props.trip.truck.maxWeight)
      : props.trip.truck.maxWeight
  return tripWeight.value > maxWeight
})

const isOverloaded = computed(() => {
  return isPalletsOverloaded.value || isWeightOverloaded.value
})

const containerClasses = computed(() => {
  const baseClasses = 'truck-drop-zone border-2 border-dashed rounded-lg p-4'

  if (isOverloaded.value) {
    return `${baseClasses} border-red-300 bg-red-50`
  }

  return `${baseClasses} border-blue-300 bg-blue-50`
})
</script>

<style scoped>
.truck-drop-zone {
  min-height: 120px;
  transition: all 0.2s ease;
}

.truck-drop-zone:hover {
  border-color: #2563eb;
}

.truck-drop-zone.bg-red-50:hover {
  border-color: #dc2626;
}

.ghost-pallet {
  opacity: 0.5;
  background: #c3d4ed;
}
</style>
