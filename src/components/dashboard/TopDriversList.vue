<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ $t('dashboard.topDriversThisYear') }}
    </h3>
    <div v-if="data?.topDriversChart" class="space-y-4">
      <div
        v-for="(driver, index) in data.topDriversChart"
        :key="driver.driverName"
        class="flex items-center justify-between p-3 border border border-blue-200 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600"
          >
            {{ index + 1 }}
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ driver.driverName }}</p>
            <p class="text-sm text-gray-500">
              {{ driver.trips }} {{ $t('dashboard.trips').toLowerCase() }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-gray-900">
            {{ driver.workingHours }} {{ $t('dashboard.workingHours') }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
      {{ $t('dashboard.noDataAvailable') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IYearlySummary } from '@/types/statistics'

interface IProps {
  data: IYearlySummary | null
}

defineProps<IProps>()
</script>
