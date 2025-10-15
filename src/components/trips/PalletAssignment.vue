<template>
  <div class="flex flex-col">
    <div class="flex-1 px-6 pt-4">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ t('trips.assignPalletsToTrucks') }}
        </h3>
        <p class="text-gray-600">
          {{ t('trips.dragPalletsToTrucks') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-4 flex items-center">
              <i class="pi pi-box mr-2"></i>
              {{ t('trips.availablePallets') }}
              <span class="ml-2 text-sm text-gray-500">
                ({{ unassignedPallets.length }})
              </span>
            </h4>

            <draggable
              v-if="unassignedPallets.length"
              item-key=""
              :list="unassignedPallets"
              :animation="200"
              ghost-class="ghost-pallet"
              :group="canEditOrder ? 'pallets' : 'disabled'"
              :disabled="!canEditOrder"
              class="min-h-32 space-y-2"
              :class="{ 'opacity-60 cursor-not-allowed': !canEditOrder }"
            >
              <template #item="{ element: palletId }">
                <DraggablePalletItem
                  :pallet-id="palletId"
                  :pallet="getPalletById(palletId)"
                  status="unassigned"
                />
              </template>
            </draggable>

            <div v-else class="text-center py-8 text-gray-500">
              <i class="pi pi-check-circle text-2xl mb-2"></i>
              <p>{{ t('trips.allPalletsAssigned') }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="grid gap-4">
            <PlannedTripItem
              v-for="trip in orderTrips"
              :key="trip._id"
              :trip="trip"
              :pallets="order?.pallets || []"
              :can-edit="canEditOrder"
              @edit="handleTripUpdate(trip._id)"
              @trip-deleted="$emit('trip-deleted')"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-10"
    >
      <div class="flex justify-end gap-3">
        <Button
          :label="t('common.cancel')"
          severity="secondary"
          @click="$emit('cancel')"
        />
        <Button
          :label="t('trips.saveTripsAndComplete')"
          :disabled="!canContinue || !canEditOrder"
          :loading="isSaving"
          @click="handleSaveTrips"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import Button from 'primevue/button'
import DraggablePalletItem from './DraggablePalletItem.vue'
import PlannedTripItem from './PlannedTripItem.vue'
import { useTripsStore } from '@/stores/trips'
import type { IOrderResponse as IOrder, IPallet } from '@/types/orders'
import { OrderStatus } from '@/types/orders'
import type { ITruck } from '@/types/trucks'

interface Props {
  order: IOrder | null
  availableTrucks: ITruck[]
}

interface Emits {
  (e: 'order-saved'): void
  (e: 'cancel'): void
  (e: 'show-trip-modal'): void
  (e: 'trip-deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const tripsStore = useTripsStore()
const { isLoadingTripOperation, orderTrips } = storeToRefs(tripsStore)
const { updateTrip } = tripsStore

const isSaving = computed(() => isLoadingTripOperation.value)

const unassignedPallets = computed({
  get: () => {
    if (!props.order?.pallets) return []

    const assignedPalletIds = new Set(
      orderTrips.value.flatMap((trip) => trip.palletIds),
    )

    return props.order.pallets
      .filter((pallet) => !assignedPalletIds.has(pallet.id))
      .map((pallet) => pallet.id)
  },
  set: () => {
    // This setter is needed for draggable but we don't need to implement it
    // as the pallets will be moved to trips
  },
})

const canEditOrder = computed(() => {
  return props.order?.status !== OrderStatus.DONE
})

const canContinue = computed(() => {
  return (
    orderTrips.value.length > 0 &&
    orderTrips.value.every((trip) => trip.palletIds.length > 0)
  )
})

function getPalletById(palletId: string): IPallet | undefined {
  return props.order?.pallets?.find((p) => p.id === palletId)
}

function handleTripUpdate(tripId: string) {
  console.log('Trip updated:', tripId)
}

async function handleSaveTrips() {
  if (!props.order || !canContinue.value) {
    return
  }

  try {
    for (const trip of orderTrips.value) {
      await updateTrip(trip._id, {
        truckId: trip.truck._id,
        startDate: trip.startDate,
        palletIds: trip.palletIds,
        estimatedFuel: trip.estimatedFuel,
        estimatedDuration: trip.estimatedDuration,
        notes: trip.notes,
      })
    }
    emit('order-saved')
  } catch (error) {
    console.error('Failed to save order:', error)
  }
}
</script>

<style scoped>
.ghost-pallet {
  opacity: 0.5;
  background: #c3d4ed;
}
</style>
