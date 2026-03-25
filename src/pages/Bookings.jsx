import React, { useEffect, useState } from 'react'
import useBookingStore from '../store/useBookingStore'
import useTherapistStore from '../store/useTherapistStore'
import Calendar from '../components/Calendar'
import BookingPanel from '../components/BookingPanel'
import BookingForm from '../components/BookingForm'
import { generateTherapists, generateBookings } from '../utils/mockData'

export default function Bookings() {
  const fetchBookings = useBookingStore((s) => s.fetchBookings)
  const loading = useBookingStore((s) => s.loading)
  const loadTherapists = useTherapistStore((s) => s.loadMock)
  const setBookings = useBookingStore.setState
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const runLoadTest = () => {
    console.time('load-test')
    const therapists = generateTherapists(200)
    loadTherapists(200)
    const bookings = generateBookings(therapists, 2000)
    setBookings({ bookings })
    console.timeEnd('load-test')
  }

  const handleSelect = (b) => {
    console.log('[bookings] selected', b && b.id)
    // if new booking form was open, close it so the selected booking details show
    setShowForm(false)
    setSelected(b)
  }

  return (
    <div className="page bookings-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bookings</h1>
        <div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>New Booking</button>
          <button className="btn btn-ghost" onClick={runLoadTest} style={{ marginLeft: 8 }}>Load 2000 bookings (test)</button>
        </div>
      </div>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <input placeholder="Search bookings by title or client" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: 8, width: 300 }} />
      </div>
      {loading && <div>Loading…</div>}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Calendar loadMock={false} onSelect={handleSelect} query={search} />
        </div>
        <div style={{ width: 360 }}>
          {/* debug: show currently selected booking id */}
          <div className="selected-debug">Selected: {selected ? selected.id : 'none'}</div>
          {showForm ? <BookingForm onClose={() => setShowForm(false)} /> : <BookingPanel booking={selected} onClose={() => setSelected(null)} />}
        </div>
      </div>
    </div>
  )
}
