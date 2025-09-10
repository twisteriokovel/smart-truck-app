<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('app.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.signInToContinue') }}
        </p>
      </div>
      <LoginForm :error="loginError" @submit="handleLogin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { AxiosError } from 'axios'
import LoginForm from '@/components/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import type { ILoginCredentials } from '@/types/auth'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const { login } = authStore

const loginError = ref('')

const handleLogin = async (credentials: ILoginCredentials) => {
  loginError.value = ''

  try {
    await login(credentials)
    router.push('/')
  } catch (error) {
    loginError.value =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      t('auth.loginError')
  }
}
</script>
