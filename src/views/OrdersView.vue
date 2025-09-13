<template>
  <AuthenticatedLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Order management will go here.</p>
        <p class="text-sm text-gray-500 mt-2">
          This page will contain functionality to manage customer orders.
        </p>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>
