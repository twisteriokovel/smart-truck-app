<template>
  <AuthenticatedLayout>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <Button
            icon="pi pi-arrow-left"
            severity="secondary"
            text
            class="mr-4"
            @click="goBack"
          />
          <h1 class="text-2xl font-bold text-gray-900">
            {{ t('orders.orderDetails') }}
          </h1>
        </div>
        <div v-if="currentOrder" class="flex gap-2">
          <Button
            v-if="canEditOrder"
            :label="t('common.edit')"
            icon="pi pi-pencil"
            severity="secondary"
            @click="editOrder"
          />
        </div>
      </div>

      <div
        v-if="isLoading"
        class="bg-white rounded-lg shadow p-6 text-center py-4"
      >
        <p class="text-gray-600">{{ t('common.loading') }}</p>
      </div>

      <div
        v-else-if="!currentOrder"
        class="bg-white rounded-lg shadow p-6 text-center py-4"
      >
        <p class="text-red-600">{{ t('orders.orderNotFound') }}</p>
      </div>

      <div v-else class="space-y-6">
        <OrderInfoCard :order="currentOrder" :order-trips="orderTrips" />

        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ t('trips.title') }}
              </h3>

              <div class="flex justify-between items-center space-x-6">
                <div class="flex justify-between items-center">
                  <label class="text-sm font-medium text-gray-700 mr-2">
                    {{
                      isEditMode ? t('orders.viewMode') : t('orders.editMode')
                    }}
                  </label>
                  <ToggleSwitch v-model="isEditMode" />
                </div>

                <Button
                  v-if="canEditOrder"
                  :label="t('trips.addTrip')"
                  icon="pi pi-plus"
                  size="small"
                  @click="showTripPlanningModal = true"
                />
              </div>
            </div>
          </div>

          <PalletAssignment
            v-if="isEditMode"
            :order="currentOrder"
            :available-trucks="availableTrucks"
            @show-trip-modal="showTripPlanningModal = true"
            @trip-changed="loadOrderData"
            @order-saved="loadOrderData"
            @cancel="isEditMode = false"
          />

          <template v-else>
            <OrderTrip
              v-for="trip in orderTrips"
              :key="trip._id"
              :order="currentOrder"
              :trip="trip"
              @click="selectedTrip = trip"
              @trip-changed="loadOrderData"
            />
          </template>
        </div>
      </div>
    </div>

    <TripModal
      v-if="currentOrder"
      v-model:visible="showTripPlanningModal"
      :available-trucks="availableTrucks"
      :order="currentOrder"
      @trip-updated="handleTripUpdate"
    />

    <TripDetailsModal
      :visible="Boolean(selectedTrip)"
      :trip="selectedTrip"
      :order="currentOrder"
      @trip-changed="loadOrderData"
      @update:visible="selectedTrip = null"
    />
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import TripModal from '@/components/trips/TripModal.vue'
import TripDetailsModal from '@/components/trips/TripDetailsModal.vue'
import PalletAssignment from '@/components/trips/PalletAssignment.vue'
import OrderInfoCard from '@/components/orders/OrderInfoCard.vue'
import OrderTrip from '@/components/orders/OrderTrip.vue'
import { getOrderById } from '@/api'
import { useTripsStore } from '@/stores/trips'
import { type IOrderResponse as IOrder, OrderStatus } from '@/types/orders'
import { type IOrderTrip } from '@/types/trips'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()
const { orderTrips, availableTrucks, editedTrip } = storeToRefs(tripsStore)
const { fetchOrderTrips, fetchAvailableTrucksForOrder } = tripsStore

const isLoading = ref(false)
const currentOrder = ref<IOrder | null>(null)
const isEditMode = ref(false)
const selectedTrip = ref<IOrderTrip | null>(null)

const orderId = route.params.id as string
const showTripPlanningModal = ref(false)

const canEditOrder = computed(() => {
  return (
    currentOrder.value &&
    currentOrder.value.status !== OrderStatus.DONE &&
    currentOrder.value.status !== OrderStatus.CANCELLED
  )
})

function goBack() {
  router.push('/orders')
}

function editOrder() {
  if (currentOrder.value) {
    router.push(`/orders/edit/${currentOrder.value._id}`)
  }
}

async function fetchOrderDetails() {
  isLoading.value = true
  try {
    currentOrder.value = await getOrderById(orderId)
  } catch (error) {
    console.error('Failed to fetch order:', error)
    currentOrder.value = null
  } finally {
    isLoading.value = false
  }
}

function handleTripUpdate(updatedTrip: IOrderTrip) {
  if (!selectedTrip.value) {
    return
  }
  selectedTrip.value = updatedTrip
}

async function loadOrderData() {
  await Promise.all([
    fetchOrderDetails(),
    fetchOrderTrips(orderId),
    fetchAvailableTrucksForOrder(orderId),
  ])
  isEditMode.value = false
}

watch(
  () => editedTrip.value,
  (val) => {
    showTripPlanningModal.value = Boolean(val)
  },
)

onBeforeMount(loadOrderData)
</script>
