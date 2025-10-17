<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t('orders.title') }}
      </h1>
      <div class="flex items-center gap-4">
        <Button @click="goToCreateOrder">
          {{ t('orders.createOrder') }}
        </Button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow">
      <DataTable
        :value="ordersList"
        :loading="isLoading"
        :rows="pageSize"
        :total-records="total"
        :rows-per-page-options="[5, 10, 25]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        paginator
        lazy
        responsive-layout="scroll"
        selection-mode="single"
        class="cursor-pointer"
        @page="page = ++$event.page"
        @row-select="onRowSelect"
      >
        <template #empty>
          <div class="text-center py-4">
            <p class="text-gray-500">{{ t('orders.noOrdersFound') }}</p>
          </div>
        </template>

        <Column field="orderNumber" :header="t('orders.orderNumber')">
          <template #body="slotProps">
            {{ slotProps.data.orderNumber }}
          </template>
        </Column>

        <Column
          field="destinationAddress"
          :header="t('orders.destination')"
          style="width: 250px"
        >
          <template #body="slotProps">
            <div class="break-words">
              {{ getAddressDisplayName(slotProps.data.destinationAddress) }}
            </div>
          </template>
        </Column>
        <Column field="cargoWeight" :header="t('orders.cargoSize')">
          <template #body="slotProps">
            {{ slotProps.data.cargoWeight }} kg
          </template>
        </Column>
        <Column field="pallets" :header="t('orders.pallets')">
          <template #body="slotProps">
            {{ getPalletsCount(slotProps.data) }}
          </template>
        </Column>

        <Column field="trips" :header="t('orders.trips')">
          <template #body="slotProps">
            {{ slotProps.data.trips.length }}
          </template>
        </Column>
        <Column field="createdAt" :header="t('orders.createdAt')">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column field="status" :header="t('orders.status')">
          <template #body="slotProps">
            <Tag v-bind="getStatusConfig(slotProps.data.status)" />
          </template>
        </Column>
        <Column :header="t('common.actions')">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                v-tooltip.top="t('common.edit')"
                icon="pi pi-pencil"
                severity="info"
                size="small"
                text
                :disabled="isActionButtonDisabled(slotProps.data.status)"
                @click.stop="goToEditOrder(slotProps.data._id)"
              />
              <Button
                v-tooltip.top="t('common.cancel')"
                icon="pi pi-times"
                severity="danger"
                size="small"
                text
                :disabled="isActionButtonDisabled(slotProps.data.status)"
                @click.stop="confirmCancelOrder(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <CancelOrderDialog
      v-model:visible="showCancelDialog"
      :order="selectedOrder"
      :is-loading="isCancelling"
      @confirm="handleCancelOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import CancelOrderDialog from './CancelOrderDialog.vue'
import { useOrdersStore } from '@/stores/orders'
import { type IOrderResponse as IOrder, OrderStatus } from '@/types/orders'
import { useOrderStatus } from '@/composables/useOrderStatus'
import { useDateFormat } from '@/composables/useDateFormat'
import { useNotification } from '@/composables/useNotification'
import { getAddressDisplayName } from '@/utils/address'

const { t } = useI18n()
const router = useRouter()
const ordersStore = useOrdersStore()
const { ordersList, isLoading, page, pageSize, total } =
  storeToRefs(ordersStore)
const { cancelOrder: cancelOrderAction, fetchOrders, $reset } = ordersStore
const { getStatusConfig } = useOrderStatus()
const { formatDate } = useDateFormat()
const { error } = useNotification()

const showCancelDialog = ref(false)
const selectedOrder = ref<IOrder | null>(null)
const isCancelling = ref(false)

function goToCreateOrder() {
  router.push('/orders/create')
}

function onRowSelect(event: { data: IOrder }) {
  router.push(`/orders/${event.data._id}`)
}

function goToEditOrder(orderId: string) {
  router.push(`/orders/edit/${orderId}`)
}

function getPalletsCount(order: IOrder): number {
  return order.pallets?.length || 0
}

function isActionButtonDisabled(status: OrderStatus) {
  return status === OrderStatus.CANCELLED || status === OrderStatus.DONE
}

function confirmCancelOrder(order: IOrder) {
  selectedOrder.value = order
  showCancelDialog.value = true
}

async function handleCancelOrder(order: IOrder) {
  isCancelling.value = true

  try {
    await cancelOrderAction(order._id)
    showCancelDialog.value = false
    selectedOrder.value = null
  } catch {
    error(t('orders.failedToCancelOrder'))
  } finally {
    isCancelling.value = false
  }
}

onBeforeMount(() => {
  $reset()
  fetchOrders()
})
</script>
