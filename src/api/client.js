import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://dev.natureland.hipster-virtual.com'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

client.interceptors.request.use((req) => {
  console.log('[api] request', { method: req.method, url: req.url })
  return req
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[api] response error', {
      message: err.message,
      status: err?.response?.status,
      data: err?.response?.data,
    })
    return Promise.reject(err)
  },
)

export default client
