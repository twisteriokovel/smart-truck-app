import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, getProfile } from '@/api'
import type { ILoginCredentials, ILoginResponse, IUser } from '@/types/auth'
import { getToken, setToken, removeToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<IUser | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  async function fetchProfile(): Promise<IUser | null> {
    try {
      const response = await getProfile()
      return response
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      logout()
      return null
    }
  }

  async function initializeAuth() {
    const storedToken = getToken()

    if (storedToken) {
      token.value = storedToken
      isLoading.value = true

      try {
        const profile = await fetchProfile()
        if (profile) {
          user.value = profile
        }
      } finally {
        isLoading.value = false
      }
    }
  }

  async function login(
    credentials: ILoginCredentials,
  ): Promise<ILoginResponse> {
    isLoading.value = true

    try {
      const response = await apiLogin(credentials)

      if (response.access_token) {
        token.value = response.access_token
        setToken(response.access_token)

        if (response.user) {
          user.value = response.user
        }
      }

      return response
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    removeToken()
  }

  return {
    // State
    token,
    user,
    isLoading,

    // Getters
    isAuthenticated,

    // Actions
    initializeAuth,
    fetchProfile,
    login,
    logout,
  }
})
