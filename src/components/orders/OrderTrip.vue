<template>
  <div class="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-4 mb-2">
          <div class="flex items-center">
            <i class="pi pi-hashtag text-gray-400 text-sm mr-1"></i>
            <span class="font-medium text-gray-900">
              {{ trip.tripNumber }}
            </span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-truck text-gray-400 text-sm mr-1"></i>
            <span class="text-gray-700">
              {{ trip.truck?.plateNumber || t('trips.noTruckAssigned') }}
            </span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-calendar text-gray-400 text-sm mr-1"></i>
            <span class="text-gray-700">
              {{ formatDateTime(trip.startDate) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center">
            <i class="pi pi-box text-gray-400 text-sm mr-1"></i>
            <span class="text-sm text-gray-600">
              {{ trip.palletIds.length }} {{ t('trips.pallets') }}
            </span>
          </div>
          <TripStatusComponent :trip="trip" />
        </div>
      </div>

      <div class="flex items-center gap-2 ml-4">
        <TripActions :trip="trip" @trip-changed="$emit('trip-changed')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDateFormat } from '@/composables/useDateFormat'
import type { IOrderTrip } from '@/types/trips'
import type { IOrderResponse as IOrder } from '@/types/orders'
import TripActions from '@/components/trips/TripActions.vue'
import TripStatusComponent from '@/components/trips/TripStatus.vue'

defineProps<{
  trip: IOrderTrip
  order: IOrder
}>()

defineEmits<{
  (e: 'trip-changed'): void
}>()

const { t } = useI18n()
const { formatDateTime } = useDateFormat()
</script>
