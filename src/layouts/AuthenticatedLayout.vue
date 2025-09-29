<template>
  <div class="h-screen bg-gray-50 flex flex-col overflow-hidden">
    <TheHeader class="flex-shrink-0" />

    <div class="flex flex-1 overflow-hidden">
      <TheSidebar class="flex-shrink-0" />

      <main class="flex-1 overflow-auto py-6 px-8">
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
