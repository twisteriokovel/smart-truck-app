<template>
  <div id="app mt-2">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { initializeAuth } = authStore

onBeforeMount(initializeAuth)
</script>
