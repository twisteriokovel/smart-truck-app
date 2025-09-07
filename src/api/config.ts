export const API_CONFIG = {
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
}

export const setBaseURL = (url: string) => {
  API_CONFIG.baseURL = url
}