<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div
      v-for="card in summaryCards"
      :key="card.key"
      class="bg-white rounded-lg shadow p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">{{ card.title }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ card.value }}</p>
        </div>
        <div class="p-3 rounded-full" :class="card.iconBg">
          <i :class="card.icon" class="text-xl"></i>
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <div
          class="flex items-center text-sm"
          :class="card.growth >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          <i
            :class="card.growth >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
            class="mr-1"
          ></i>
          <span>{{ Math.abs(card.growth) }}%</span>
        </div>
        <span class="text-gray-500 text-sm ml-2">
          {{ $t('dashboard.vsLastMonth') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IMonthlySummary } from '@/types/statistics'

interface IProps {
  data: IMonthlySummary | null
}

const props = defineProps<IProps>()
const { t } = useI18n()

const summaryCards = computed(() => {
  if (!props.data) return []

  return [
    {
      key: 'orders',
      title: t('dashboard.totalOrders'),
      value: props.data.totalOrders.toLocaleString(),
      growth: props.data.growth.ordersGrowth,
      icon: 'pi pi-shopping-cart',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      key: 'trips',
      title: t('dashboard.totalTrips'),
      value: props.data.totalTrips.toLocaleString(),
      growth: props.data.growth.tripsGrowth,
      icon: 'pi pi-truck',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      key: 'fuel',
      title: t('dashboard.totalFuelLiters'),
      value: props.data.totalFuelLiters.toLocaleString(),
      growth: props.data.growth.fuelGrowth,
      icon: 'pi pi-chart-bar',
      iconBg: 'bg-yellow-100 text-yellow-600',
    },
    {
      key: 'hours',
      title: t('dashboard.totalHours'),
      value: props.data.totalHours.toLocaleString(),
      growth: props.data.growth.hoursGrowth,
      icon: 'pi pi-clock',
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ]
})
</script>
