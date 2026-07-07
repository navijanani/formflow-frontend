import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'formflow_token'

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: apiBaseUrl,
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.dispatchEvent(new Event('formflow:unauthorized'))
    }
    return Promise.reject(error)
  },
)

// Request deduplication for GET requests only
const pendingGets = new Map()
const originalGet = api.get.bind(api)

api.get = function (url, config) {
  const key = `${url}:${JSON.stringify(config?.params || {})}`
  
  if (pendingGets.has(key)) {
    return pendingGets.get(key)
  }
  
  const promise = originalGet(url, config).finally(() => {
    pendingGets.delete(key)
  })
  
  pendingGets.set(key, promise)
  return promise
}

export default api
