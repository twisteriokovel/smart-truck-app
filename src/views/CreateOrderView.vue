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
        {{ t('orders.createOrder') }}
      </h1>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <OrderForm
        :is-loading="isSaving"
        @submit="handleFormSubmit"
        @cancel="goBack"
      />
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import OrderForm from '@/components/orders/OrderForm.vue'
import { useOrdersStore } from '@/stores/orders'
import { useNotification } from '@/composables/useNotification'
import type { IOrderFormData } from '@/types/orders'

const { t } = useI18n()
const router = useRouter()

const ordersStore = useOrdersStore()
const { createOrder } = ordersStore
const { error } = useNotification()

const isSaving = ref(false)

function goBack() {
  router.push('/orders')
}

async function handleFormSubmit(formData: IOrderFormData) {
  isSaving.value = true

  try {
    await createOrder(formData)
    router.push('/orders')
  } catch (err) {
    console.error('Failed to create order:', err)
    error(t('orders.failedToSaveOrder'))
  } finally {
    isSaving.value = false
  }
}
</script>
