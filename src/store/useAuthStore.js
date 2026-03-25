import create from 'zustand'
import client from '../api/client'

const useAuthStore = create((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  setToken: (token) => {
    if (typeof window !== 'undefined') localStorage.setItem('token', token)
    set({ token })
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token')
    set({ token: null, user: null })
  },
  login: async (email, password) => {
    try {
      // key_pass from spec
      const key_pass = '07ba959153fe7eec778361bf42079439'
      const res = await client.post('/api/v1/login', { email, password, key_pass })
      const token = res?.data?.token || res?.data?.data?.token || null
      if (token) {
        if (typeof window !== 'undefined') localStorage.setItem('token', token)
        set({ token })
      }
      return res
    } catch (err) {
      console.error('[auth] login error', err)
      throw err
    }
  },
}))

export default useAuthStore
