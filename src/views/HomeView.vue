<template>
  <AuthenticatedLayout>
    <div class="home">
      <h1 class="text-3xl font-bold mb-4">{{ $t('app.welcome') }}</h1>
      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-600 mb-4">
          {{ $t('app.welcomeMessage') }}
        </p>
        <Button :label="$t('app.getStarted')" icon="pi pi-arrow-right" />
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>
