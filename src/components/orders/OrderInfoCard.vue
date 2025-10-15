<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {{ t('orders.basicInfo') }}
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('orders.cargoSize') }}
          </label>
          <p class="mt-1 text-sm text-gray-900">{{ order.cargoWeight }} kg</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('orders.assignedCargo') }}
          </label>
          <p class="mt-1 text-sm text-gray-900">{{ totalAssignedWeight }} kg</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('orders.remainingCargo') }}
          </label>
          <p class="mt-1 text-sm text-gray-900">{{ remainingWeight }} kg</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('orders.status') }}
          </label>
          <div class="mt-1">
            <Tag v-bind="getStatusConfig(order.status)" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ t('orders.destination') }}
          </label>
          <p class="mt-1 text-sm text-gray-900">
            {{
              order.destinationAddress
                ? getAddressDisplayName(order.destinationAddress)
                : order.destinationAddressId
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import { useOrderStatus } from '@/composables/useOrderStatus'
import { getAddressDisplayName } from '@/utils/address'

import type { IOrderResponse as IOrder } from '@/types/orders'
import type { IOrderTrip } from '@/types/trips'

interface Props {
  order: IOrder
  orderTrips: IOrderTrip[]
}

const props = defineProps<Props>()

const { t } = useI18n()
const { getStatusConfig } = useOrderStatus()

const totalAssignedWeight = computed(() => {
  if (!props.order?.pallets || !props.orderTrips.length) return 0

  const assignedPalletIds = new Set(
    props.orderTrips.flatMap((trip) => trip.palletIds),
  )

  return props.order.pallets
    .filter((pallet) => assignedPalletIds.has(pallet.id))
    .reduce((total, pallet) => total + (pallet.weight || 0), 0)
})

const remainingWeight = computed(() => {
  if (!props.order) return 0
  return props.order.cargoWeight - totalAssignedWeight.value
})
</script>
