<template>
  <div class="bg-white rounded-lg shadow p-6 h-full">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ $t('dashboard.tripsByLocation') }}
    </h3>
    <div class="flex items-center space-x-6 py-6">
      <div class="flex-1">
        <Chart
          v-if="chartData"
          type="pie"
          :data="chartData"
          :options="chartOptions"
          class="h-80"
        />
        <div v-else class="h-80 flex items-center justify-center text-gray-500">
          {{ $t('errors.noDataAvailable') }}
        </div>
      </div>
      <div class="w-64 space-y-3">
        <div
          v-for="(location, index) in locationData"
          :key="location.location"
          class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getColor(index) }"
            />
            <span class="text-sm font-medium text-gray-700">
              {{ location.location }}
            </span>
          </div>
          <span class="text-sm text-gray-500">{{ location.trips }} trips</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Chart from 'primevue/chart'
import type { IYearlySummary } from '@/types/statistics'

interface IProps {
  data: IYearlySummary | null
}

const props = defineProps<IProps>()

const colors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F472B6', // Rose
  '#A78BFA', // Violet
  '#34D399', // Emerald
  '#FBBF24', // Amber
  '#FB7185', // Red-Pink
  '#60A5FA', // Light Blue
  '#A3E635', // Light Green
  '#FACC15', // Golden
  '#C084FC', // Light Purple
  '#22D3EE', // Sky
  '#FB923C', // Light Orange
  '#4ADE80', // Bright Green
  '#E879F9', // Fuchsia
  '#94A3B8', // Slate
]

const getColor = (index: number) => {
  if (index < colors.length) {
    return colors[index]
  }
  const hue = (index * 137) % 360
  return `hsl(${hue}, 65%, 55%)`
}

const chartData = computed(() => {
  if (!props.data) return null

  return {
    labels: props.data.locationsPieChart.map((item) => item.location),
    datasets: [
      {
        data: props.data.locationsPieChart.map((item) => item.trips),
        backgroundColor: props.data.locationsPieChart.map((_, index) =>
          getColor(index),
        ),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  }
})

const locationData = computed(() => {
  if (!props.data) return []
  return props.data.locationsPieChart
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
}))
</script>
