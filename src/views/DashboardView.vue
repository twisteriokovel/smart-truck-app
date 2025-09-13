<template>
  <AuthenticatedLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Welcome to the Smart Truck App dashboard!</p>
        <p class="text-sm text-gray-500 mt-2">
          This is where your main dashboard content will go.
        </p>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>
