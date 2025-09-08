export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
}

export const setBaseURL = (url: string) => {
  API_CONFIG.baseURL = url
}
