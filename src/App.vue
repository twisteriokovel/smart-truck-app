<template>
  <div id="app mt-2">
    <RouterView />
  </div>
  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { initializeAuth } = authStore

onBeforeMount(initializeAuth)
</script>
