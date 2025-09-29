<template>
  <AuthenticatedLayout>
    <div class="flex items-center mb-6">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        class="mr-4"
        @click="goBack"
      />
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t('orders.editOrder') }}
      </h1>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div v-if="isLoading" class="text-center py-4">
        <p class="text-gray-600">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="!currentOrder" class="text-center py-4">
        <p class="text-red-600">Order not found</p>
      </div>

      <div v-else>
        <OrderForm
          :order="currentOrder"
          :is-loading="isSaving"
          :readonly="currentOrder.status === 'cancelled'"
          @submit="handleFormSubmit"
          @cancel="goBack"
        />
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import OrderForm from '@/components/orders/OrderForm.vue'
import { getOrderById } from '@/api'
import { useOrdersStore } from '@/stores/orders'
import { useNotification } from '@/composables/useNotification'
import type {
  IOrderResponse as IOrder,
  IOrderFormData,
} from '@/types/orders'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const ordersStore = useOrdersStore()
const { editOrder } = ordersStore
const { error } = useNotification()

const isLoading = ref(false)
const isSaving = ref(false)
const currentOrder = ref<IOrder | null>(null)

const orderId = route.params.id as string

function goBack() {
  router.push('/orders')
}

async function fetchOrderDetails() {
  isLoading.value = true
  try {
    currentOrder.value = await getOrderById(orderId)
  } catch (err) {
    console.error('Failed to fetch order:', err)
    error(t('orders.failedToFetchOrder'))
    currentOrder.value = null
  } finally {
    isLoading.value = false
  }
}

async function handleFormSubmit(formData: IOrderFormData) {
  isSaving.value = true

  try {
    await editOrder(orderId, formData)
    router.push('/orders')
  } catch (err) {
    console.error('Failed to update order:', err)
    error(t('orders.failedToSaveOrder'))
  } finally {
    isSaving.value = false
  }
}

onBeforeMount(fetchOrderDetails)
</script>