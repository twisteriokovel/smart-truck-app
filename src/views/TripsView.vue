<template>
  <AuthenticatedLayout>
    <div class="p-6">
      <TripsList />
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import TripsList from '@/components/trips/TripsList.vue'
</script>
