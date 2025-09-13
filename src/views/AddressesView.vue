<template>
  <AuthenticatedLayout>
    <AddressesList />
    <AddressDialog />
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AddressesList from '@/components/addresses/AddressesList.vue'
import AddressDialog from '@/components/addresses/AddressDialog.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
</script>
