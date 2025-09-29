<template>
  <AuthenticatedLayout>
    <OrdersList />
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import OrdersList from '@/components/orders/OrdersList.vue'
</script>
