import create from 'zustand'
import client from '../api/client'
import localforage from 'localforage'
import { v4 as uuidv4 } from 'uuid'

const BOOKINGS_KEY = 'bookings_cache_v1'

const useBookingStore = create((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  async initFromCache() {
    const cached = await localforage.getItem(BOOKINGS_KEY)
    if (cached) set({ bookings: cached })
  },
  async fetchBookings() {
    set({ loading: true, error: null })
    try {
      const res = await client.get('/api/v1/bookings')
      const data = res?.data?.data || res?.data || []
      set({ bookings: data })
      await localforage.setItem(BOOKINGS_KEY, data)
      return data
    } catch (err) {
      console.error('[bookingStore] fetch error', err)
      set({ error: err })
      // try cache
      const cached = await localforage.getItem(BOOKINGS_KEY)
      if (cached) set({ bookings: cached })
      return cached || []
    } finally {
      set({ loading: false })
    }
  },
  async createBooking(payload) {
    // optimistic create
    const temp = { ...payload, id: payload.id || `temp-${uuidv4()}`, _optimistic: true }
    set((s) => ({ bookings: [temp, ...s.bookings] }))
    try {
      const res = await client.post('/api/v1/bookings/create', payload)
      const created = res?.data?.data || res?.data || payload
      // replace temp
      set((s) => ({ bookings: s.bookings.map((b) => (b.id === temp.id ? created : b)) }))
      await localforage.setItem(BOOKINGS_KEY, get().bookings)
      return created
    } catch (err) {
      console.error('[bookingStore] create error', err)
      // rollback
      set((s) => ({ bookings: s.bookings.filter((b) => b.id !== temp.id) }))
      throw err
    }
  },
  async updateBooking(id, patch) {
    // optimistic update
    const prev = get().bookings
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) }))
    try {
      const res = await client.put(`/api/v1/bookings/${id}`, patch)
      const updated = res?.data?.data || res?.data || { id, ...patch }
      set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? updated : b)) }))
      await localforage.setItem(BOOKINGS_KEY, get().bookings)
      return updated
    } catch (err) {
      console.error('[bookingStore] update error', err)
      // rollback
      set({ bookings: prev })
      throw err
    }
  },
  async cancelBooking(id) {
    // optimistic cancel: mark status cancelled
    const prev = get().bookings
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)) }))
    try {
      const res = await client.post(`/api/v1/bookings/item/cancel`, { id })
      await localforage.setItem(BOOKINGS_KEY, get().bookings)
      return res
    } catch (err) {
      console.error('[bookingStore] cancel error', err)
      set({ bookings: prev })
      throw err
    }
  },
  async deleteBooking(id) {
    const prev = get().bookings
    // optimistic remove
    set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) }))
    try {
      const res = await client.delete(`/api/v1/bookings/destroy/${id}`)
      await localforage.setItem(BOOKINGS_KEY, get().bookings)
      return res
    } catch (err) {
      console.error('[bookingStore] delete error', err)
      // rollback
      set({ bookings: prev })
      throw err
    }
  },
}))

export default useBookingStore
