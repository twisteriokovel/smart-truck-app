<template>
  <Dialog
    :visible="visible"
    :header="t('trips.tripDetails')"
    modal
    class="w-full max-w-4xl"
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-if="trip" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('trips.tripNumber') }}
            </label>
            <p class="text-gray-900 font-mono">{{ trip.tripNumber }}</p>
          </div>

          <div v-if="enableOrderLink && order">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('orders.order') }}
            </label>
            <RouterLink :to="`/orders/${trip.orderId}`">
              <p class="text-gray-900">{{ order.orderNumber }}</p>
            </RouterLink>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('trips.actions') }}
            </label>
            <TripActions
              v-if="trip"
              :trip="trip"
              @trip-changed="handleTripAction"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('trips.status.title') }}
            </label>
            <TripStatusComponent :trip="trip" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('trips.startDate') }}
            </label>
            <p class="text-gray-900">
              {{ formatDateTime(trip.startDate) }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('trucks.title') }}
            </label>
            <div v-if="trip.truck" class="bg-gray-50 rounded-lg p-3">
              <div class="flex items-center">
                <i class="pi pi-truck text-blue-600 mr-2"></i>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ trip.truck.plateNumber }}
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <span class="text-gray-600"
                    >{{ t('trucks.maxWeight') }}:</span
                  >
                  <span class="ml-1 font-medium"
                    >{{ trip.truck.maxWeight }} kg</span
                  >
                </div>
                <div>
                  <span class="text-gray-600"
                    >{{ t('trucks.maxPallets') }}:</span
                  >
                  <span class="ml-1 font-medium">{{
                    trip.truck.maxPallets
                  }}</span>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 italic">
              {{ t('trips.noTruckAssigned') }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('orders.destination') }}
            </label>
            <div
              v-if="order?.destinationAddress"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="flex items-start">
                <i class="pi pi-map-marker text-red-600 mr-2 mt-0.5"></i>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ order.destinationAddress.addressLine1 }}
                  </p>
                  <p
                    v-if="order.destinationAddress.addressLine2"
                    class="text-sm text-gray-600"
                  >
                    {{ order.destinationAddress.addressLine2 }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ order.destinationAddress.city }},
                    {{ order.destinationAddress.state }}
                    {{ order.destinationAddress.postcode }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-medium text-gray-900">
            {{ t('trips.assignedPallets') }}
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ assignedPallets.length }})
            </span>
          </h4>
          <div class="text-sm text-gray-600">
            <span class="font-medium">{{ t('trips.totalWeight') }}:</span>
            {{ totalWeight }} kg
          </div>
        </div>

        <div
          v-if="
            trip.status === TripStatus.DONE &&
            (trip.actualFuel || trip.actualDuration)
          "
          class="mb-6"
        >
          <h4 class="text-lg font-medium text-gray-900 mb-4">
            {{ t('trips.tripMetrics') }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="trip.actualFuel" class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center">
                <i
                  class="display-inline-block pi pi-bolt text-green-600 mr-2"
                ></i>
                <div>
                  <p class="text-sm text-green-700">
                    {{ t('trips.actualFuel') }}
                  </p>
                  <p class="font-medium text-green-900">
                    {{ trip.actualFuel }} L
                  </p>
                </div>
              </div>
            </div>
            <div v-if="trip.actualDuration" class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center">
                <i
                  class="display-inline-block pi pi-clock text-blue-600 mr-2"
                ></i>
                <div>
                  <p class="text-sm text-blue-700">
                    {{ t('trips.actualDuration') }}
                  </p>
                  <p class="font-medium text-blue-900">
                    {{ trip.actualDuration }} {{ t('trips.hours') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="assignedPallets.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <i class="pi pi-box text-2xl mb-2 block"></i>
          <p>{{ t('trips.noPalletsAssigned') }}</p>
        </div>

        <div v-else class="grid gap-3">
          <DraggablePalletItem
            v-for="pallet in assignedPallets"
            :key="pallet.id"
            :pallet-id="pallet.id"
            :pallet="pallet"
            size="normal"
            status="assigned"
            no-draggable
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import TripStatusComponent from '@/components/trips/TripStatus.vue'
import DraggablePalletItem from '@/components/trips/DraggablePalletItem.vue'
import TripActions from '@/components/trips/TripActions.vue'
import { useDateFormat } from '@/composables/useDateFormat'
import { TripStatus } from '@/types/trips'
import type { IOrderTrip } from '@/types/trips'
import type { IOrderResponse as IOrder, IPallet } from '@/types/orders'

interface Props {
  visible: boolean
  trip: IOrderTrip | null
  order: IOrder | null
  enableOrderLink?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'edit-trip', trip: IOrderTrip): void
  (e: 'trip-changed'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const { formatDateTime } = useDateFormat()

const assignedPallets = computed((): IPallet[] => {
  if (!props.trip || !props.order?.pallets) return []

  return props.order.pallets.filter((pallet) =>
    props.trip!.palletIds.includes(pallet.id),
  )
})

const totalWeight = computed((): number => {
  return assignedPallets.value.reduce(
    (total, pallet) => total + (pallet.weight || 0),
    0,
  )
})

function handleTripAction() {
  emit('trip-changed')
  emit('update:visible', false)
}
</script>
