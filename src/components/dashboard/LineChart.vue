<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ title }}
    </h3>
    <Chart
      v-if="chartData"
      type="line"
      :data="chartData!"
      :options="chartOptions"
      class="h-80"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Chart from 'primevue/chart'
import type { IYearlySummary } from '@/types/statistics'

interface IProps {
  data: IYearlySummary | null
  title: string
  dataKey: string
  labelKey: string
  color: string
}

const props = defineProps<IProps>()

const chartData = computed(() => {
  if (!props.data) return null

  const monthlyData = props.data[
    props.dataKey as keyof IYearlySummary
  ] as Array<{ month: string; [key: string]: any }>

  return {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: props.labelKey,
        data: monthlyData.map(
          (item) => item[props.dataKey.replace('PerMonth', '')],
        ),
        fill: false,
        borderColor: props.color,
        backgroundColor: props.color,
        tension: 0.4,
        pointBackgroundColor: props.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
      },
    },
  },
}))
</script>
