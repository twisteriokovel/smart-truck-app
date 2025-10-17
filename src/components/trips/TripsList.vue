<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t('trips.title') }}
      </h1>
    </div>

    <div class="bg-white rounded-lg shadow">
      <DataTable
        :value="trips"
        :loading="isLoading"
        :rows="pageSize"
        :total-records="total"
        :rows-per-page-options="[5, 10, 25]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        paginator
        lazy
        responsive-layout="scroll"
        @page="page = ++$event.page"
      >
        <template #empty>
          <div class="text-center py-4">
            <p class="text-gray-500">{{ t('trips.noTripsFound') }}</p>
          </div>
        </template>

        <Column field="tripNumber" :header="t('trips.tripNumber')"></Column>
        <Column :header="t('trips.truck')">
          <template #body="slotProps">
            {{ slotProps.data.truck?.plateNumber || slotProps.data.truckId }}
          </template>
        </Column>
        <Column :header="t('trips.startDate')">
          <template #body="slotProps">
            {{
              formatDate(slotProps.data.startedAt || slotProps.data.createdAt)
            }}
          </template>
        </Column>
        <Column :header="t('trips.status.title')">
          <template #body="slotProps">
            <TripStatusComponent :trip="slotProps.data" />
          </template>
        </Column>
        <Column :header="t('common.actions')">
          <template #body="slotProps">
            <Button
              v-tooltip.top="t('trips.viewDetails')"
              icon="pi pi-eye"
              severity="secondary"
              size="small"
              text
              :loading="isLoadingOrder"
              @click="viewTripDetails(slotProps.data)"
            />
            <TripActions :trip="slotProps.data" />
          </template>
        </Column>
      </DataTable>
    </div>

    <TripDetailsModal
      :visible="Boolean(selectedTrip)"
      :trip="selectedTrip"
      :order="currentOrder"
      enable-order-link
      @update:visible="selectedTrip = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Column from 'primevue/column'
import TripActions from '@/components/trips/TripActions.vue'
import TripStatusComponent from '@/components/trips/TripStatus.vue'
import TripDetailsModal from '@/components/trips/TripDetailsModal.vue'
import type { IOrderResponse as IOrder } from '@/types/orders'
import type { IOrderTrip } from '@/types/trips'
import { getOrderById } from '@/api'
import { useTripsStore } from '@/stores/trips'
import { useDateFormat } from '@/composables/useDateFormat'
import { useNotification } from '@/composables/useNotification'

const { t } = useI18n()
const { formatDate } = useDateFormat()
const { error } = useNotification()

const tripsStore = useTripsStore()
const {
  trips,
  isLoadingTrips: isLoading,
  page,
  pageSize,
  total,
} = storeToRefs(tripsStore)
const { fetchAllTrips, $reset } = tripsStore

const isLoadingOrder = ref(false)
const currentOrder = ref<IOrder | null>(null)
const selectedTrip = ref<IOrderTrip | null>(null)
const tripOrderId = ref('')

async function fetchOrderDetails() {
  isLoadingOrder.value = true
  try {
    currentOrder.value = await getOrderById(tripOrderId.value)
  } catch {
    error(t('orders.failedToFetchOrder'))
    currentOrder.value = null
  } finally {
    isLoadingOrder.value = false
  }
}

async function viewTripDetails(trip: IOrderTrip) {
  if (trip.orderId === tripOrderId.value) {
    selectedTrip.value = trip
    return
  }
  tripOrderId.value = trip.orderId
  await fetchOrderDetails()
  selectedTrip.value = trip
}

onBeforeMount(() => {
  $reset()
  fetchAllTrips()
})
</script>
