<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ $t('dashboard.monthlyExpenses') }}
    </h3>
    <Chart
      v-if="chartData"
      type="bar"
      :data="chartData!"
      :options="chartOptions"
      class="h-80"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'
import type { IYearlySummary } from '@/types/statistics'

interface IProps {
  data: IYearlySummary | null
}

const props = defineProps<IProps>()
const { t } = useI18n()

const chartData = computed(() => {
  if (!props.data) return null

  return {
    labels: props.data.expensesPerMonth.map((item) => item.month),
    datasets: [
      {
        label: t('dashboard.fuelCosts'),
        data: props.data.expensesPerMonth.map((item) => item.fuelCost),
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
        borderWidth: 1,
      },
      {
        label: t('dashboard.laborCosts'),
        data: props.data.expensesPerMonth.map((item) => item.laborCost),
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        callback: function (value: any) {
          return 'UAH ' + value.toLocaleString()
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return (
            context.dataset.label + ': UAH ' + context.parsed.y.toLocaleString()
          )
        },
        footer: function (tooltipItems: any[]) {
          let total = 0
          tooltipItems.forEach((item) => {
            total += item.parsed.y
          })
          return 'Total: UAH ' + total.toLocaleString()
        },
      },
    },
  },
}))
</script>
