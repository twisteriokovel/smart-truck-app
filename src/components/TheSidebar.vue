<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200">
    <nav class="mt-8">
      <ul class="space-y-1 px-3">
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              $route.name === item.name
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            <i :class="item.icon" class="mr-3 text-lg"></i>
            {{ $t(item.translationKey) }}
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { MENU_ITEMS } from '@/utils/constants'

const menuItems = MENU_ITEMS
</script>
