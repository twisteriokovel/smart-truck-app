<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('orders.cancelOrder')"
    :style="{ width: '450px' }"
  >
    <div class="mb-4">
      <p class="text-gray-700">
        {{ t('orders.cancelOrderConfirmation') }}
      </p>
      <div
        v-if="order && order.destinationAddress"
        class="mt-3 p-3 bg-gray-50 rounded-md"
      >
        <strong>{{ t('orders.destination') }}:</strong>
        <div class="text-sm text-gray-600 mt-1">
          {{ getAddressDisplayName(order.destinationAddress) }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          :label="t('common.cancel')"
          severity="secondary"
          @click="handleCancel"
        />
        <Button
          :label="t('orders.cancelOrder')"
          severity="danger"
          :loading="isLoading"
          @click="handleConfirm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { getAddressDisplayName } from '@/utils/address'
import type { IOrderResponse as IOrder } from '@/types/orders'

interface Props {
  order: IOrder | null
  isLoading?: boolean
}

interface Emits {
  (e: 'confirm', order: IOrder): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const visible = defineModel<boolean>('visible', { default: false })

function handleCancel() {
  visible.value = false
}

function handleConfirm() {
  if (props.order) {
    emit('confirm', props.order)
  }
}
</script>
