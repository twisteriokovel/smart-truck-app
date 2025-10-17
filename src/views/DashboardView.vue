<template>
  <AuthenticatedLayout>
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t('sidebar.dashboard') }}
        </h1>
        <div class="flex items-center gap-4">
          <Button @click="goToCreateOrder">
            {{ t('orders.createOrder') }}
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <ProgressSpinner />
      </div>

      <div v-else>
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ $t('dashboard.monthOverview') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MonthlySummaryCard
              v-for="item in summaryCards"
              :key="item.key"
              :item="item"
            />
          </div>
        </div>

        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ $t('dashboard.yearOverview') }}
            </h2>
            <Dropdown
              v-model="selectedYear"
              :options="yearOptions"
              option-label="label"
              option-value="value"
              @change="fetchYearlyData"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LineChart
              :data="yearlyData"
              :title="$t('dashboard.ordersPerMonth')"
              data-key="ordersPerMonth"
              :label-key="$t('dashboard.orders')"
              color="#3B82F6"
            />
            <LineChart
              :data="yearlyData"
              :title="$t('dashboard.tripsPerMonth')"
              data-key="tripsPerMonth"
              :label-key="$t('dashboard.trips')"
              color="#10B981"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="lg:col-span-2">
              <LocationsPieChart :data="yearlyData" />
            </div>
            <TopDriversList :data="yearlyData" />
          </div>
          <div class="grid grid-cols-1 gap-6 mb-6">
            <ExpensesStackChart :data="yearlyData" />
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import MonthlySummaryCard from '@/components/dashboard/MonthlySummaryCard.vue'
import LineChart from '@/components/dashboard/LineChart.vue'
import LocationsPieChart from '@/components/dashboard/LocationsPieChart.vue'
import TopDriversList from '@/components/dashboard/TopDriversList.vue'
import ExpensesStackChart from '@/components/dashboard/ExpensesStackChart.vue'
import { getMonthlySummary, getYearlyChartsData } from '@/api/methods'
import type { IMonthlySummary, IYearlySummary } from '@/types/statistics'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { t } = useI18n()
const { error } = useNotification()

const isLoading = ref(true)
const selectedYear = ref(new Date().getFullYear())
const monthlySummary = ref<IMonthlySummary | null>(null)
const yearlyData = ref<IYearlySummary | null>(null)

const yearOptions = ref([{ label: '2025', value: 2025 }])

const summaryCards = computed(() => {
  if (!monthlySummary.value) return []

  return [
    {
      key: 'orders',
      title: t('dashboard.orders'),
      value: monthlySummary.value.totalOrders.toLocaleString(),
      growth: monthlySummary.value.growth.ordersGrowth,
      icon: 'pi pi-shopping-cart',
      iconBg: 'bg-blue-500',
    },
    {
      key: 'trips',
      title: t('dashboard.trips'),
      value: monthlySummary.value.totalTrips.toLocaleString(),
      growth: monthlySummary.value.growth.tripsGrowth,
      icon: 'pi pi-send',
      iconBg: 'bg-purple-500',
    },
    {
      key: 'fuel',
      title: t('dashboard.fuelLiters'),
      value: monthlySummary.value.totalFuelLiters.toLocaleString() + 'L',
      growth: monthlySummary.value.growth.fuelGrowth,
      icon: 'pi pi-chart-bar',
      iconBg: 'bg-orange-500',
    },
    {
      key: 'hours',
      title: t('dashboard.hours'),
      value: monthlySummary.value.totalHours.toLocaleString() + 'hrs',
      growth: monthlySummary.value.growth.hoursGrowth,
      icon: 'pi pi-clock',
      iconBg: 'bg-green-500',
    },
  ]
})

async function fetchMonthlySummary() {
  try {
    monthlySummary.value = await getMonthlySummary()
  } catch (err) {
    console.error('Error fetching monthly summary:', err)
    error(t('errors.fetchingMonthlySummary'))
  }
}

async function fetchYearlyData() {
  try {
    yearlyData.value = await getYearlyChartsData(selectedYear.value)
  } catch (err) {
    console.error('Error fetching yearly data:', err)
    error(t('errors.fetchingYearlyData'))
  }
}

async function loadDashboardData() {
  isLoading.value = true
  try {
    await Promise.all([fetchMonthlySummary(), fetchYearlyData()])
  } finally {
    isLoading.value = false
  }
}

function goToCreateOrder() {
  router.push('/orders/create')
}

onBeforeMount(loadDashboardData)
</script>
