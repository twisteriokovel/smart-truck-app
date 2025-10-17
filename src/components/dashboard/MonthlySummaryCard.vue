<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="mb-4">
      <div
        class="p-2 rounded-lg h-10 w-10 flex items-center justify-center"
        :class="item.iconBg"
      >
        <i :class="item.icon" class="text-xl text-white"></i>
      </div>
    </div>

    <p class="text-sm font-medium text-gray-600 mb-2">{{ item.title }}</p>

    <p class="text-3xl font-bold text-gray-900 mb-4">{{ item.value }}</p>

    <div class="flex items-center">
      <div
        class="flex items-center text-sm"
        :class="item.growth >= 0 ? 'text-green-600' : 'text-red-600'"
      >
        <i
          :class="item.growth >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
          class="mr-1"
        ></i>
        <span>{{ Math.abs(item.growth) }}%</span>
      </div>
      <span class="text-gray-500 text-sm ml-2">
        {{ $t('dashboard.vsLastMonth') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISummaryCard } from '@/types/statistics'

defineProps<{
  item: ISummaryCard
}>()
</script>
