import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { API_CONFIG } from './config'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        config.baseURL = API_CONFIG.baseURL

        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    // this.client.interceptors.response.use(
    //   (response) => response,
    //   async (error) => {
    //     console.error('API Error:', error.response?.data || error.message)

    //     if (error.response?.status === 401) {
    //       localStorage.removeItem('auth_token')
    //       localStorage.removeItem('auth_user')
    //       if (typeof window !== 'undefined' && (window as any).__PINIA__) {
    //         try {
    //           const { useAuthStore } = await import('@/stores/auth')
    //           const authStore = useAuthStore()
    //           authStore.clearAuth()
    //         } catch (e) {
    //           console.error(e)
    //         }
    //       }
    //       window.location.href = '/login'
    //     }

    //     return Promise.reject(error)
    //   },
    // )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config)
    return response.data
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config,
    )
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
