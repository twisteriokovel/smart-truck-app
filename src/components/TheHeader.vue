<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-900">
            {{ $t('app.title') }}
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <LanguageSwitcher />

          <div class="relative">
            <Menu ref="isShownUserMenu" :model="menuItems" :popup="true">
              <template #item="{ item }">
                <div
                  class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <i :class="item.icon" class="mr-2"></i>
                  <span>{{ item.label }}</span>
                </div>
              </template>
            </Menu>

            <Avatar
              :label="getUserInitials"
              class="cursor-pointer bg-blue-500 text-white"
              shape="circle"
              @click="toggleUserMenu"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

interface IMenuItem {
  label: string
  icon: string
  command: () => void
}

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logout } = authStore

const isShownUserMenu = ref()

const menuItems: IMenuItem[] = [
  {
    label: t('common.settings'),
    icon: 'pi pi-cog',
    command: handleSettings,
  },
  {
    label: t('auth.logout'),
    icon: 'pi pi-sign-out',
    command: handleLogout,
  },
]

const getUserInitials = computed(() => {
  if (user.value?.email) {
    const email = user.value.email
    return email.charAt(0).toUpperCase()
  }
  return 'U'
})

function toggleUserMenu(event: Event) {
  isShownUserMenu.value.toggle(event)
}

function handleSettings(): void {
  // TODO: Navigate to settings page
  console.log('Navigate to settings')
}

function handleLogout(): void {
  logout()
  router.push('/login')
}
</script>
