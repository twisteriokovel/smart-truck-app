<template>
  <AuthenticatedLayout>
    <div class="p-6">
      <TrucksList />
      <TruckDialog />
      <TruckDetailsDialog />
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import TrucksList from '@/components/trucks/TrucksList.vue'
import TruckDialog from '@/components/trucks/TruckDialog.vue'
import TruckDetailsDialog from '@/components/trucks/TruckDetailsDialog.vue'
</script>
