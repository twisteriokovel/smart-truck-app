<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <TheHeader />

    <div class="flex flex-grow-1">
      <TheSidebar />

      <main class="flex-1 py-6 px-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheSidebar from '@/components/TheSidebar.vue'
</script>
