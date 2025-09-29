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
            :label="t('common.edit')"
            icon="pi pi-pencil"
            @click="editOrder"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div v-if="isLoading" class="text-center py-4">
          <p class="text-gray-600">{{ t('common.loading') }}</p>
        </div>

        <div v-else-if="!currentOrder" class="text-center py-4">
          <p class="text-red-600">Order not found</p>
        </div>

        <div v-else class="space-y-6">
          <div class="border-b pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('orders.basicInfo') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ t('orders.cargoSize') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ currentOrder.cargoSize }} kg
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ t('orders.remainingCargo') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ currentOrder.remainingCargo }} kg
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ t('orders.status') }}
                </label>
                <div class="mt-1">
                  <Tag v-bind="getStatusConfig(currentOrder.status)" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ t('orders.destination') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ currentOrder.destinationAddressId }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-b pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('orders.tripsInfo') }}
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('orders.totalTrips') }}
              </label>
              <p class="mt-1 text-sm text-gray-900">
                {{ currentOrder.trips.length }}
              </p>
            </div>
          </div>

          <div v-if="currentOrder.notes">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('orders.additionalInfo') }}
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('orders.notes') }}
              </label>
              <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {{ currentOrder.notes }}
              </p>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('orders.timestamps') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ t('orders.createdAt') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDateTime(currentOrder.createdAt) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ t('orders.updatedAt') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDateTime(currentOrder.updatedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { getOrderById } from '@/api'
import { useOrderStatus } from '@/composables/useOrderStatus'
import { useDateFormat } from '@/composables/useDateFormat'
import type { IOrderResponse as IOrder } from '@/types/orders'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const currentOrder = ref<IOrder | null>(null)
const { getStatusConfig } = useOrderStatus()
const { formatDateTime } = useDateFormat()

const orderId = route.params.id as string

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


onBeforeMount(fetchOrderDetails)
</script>
