import React, { useState } from 'react'
import useBookingStore from '../store/useBookingStore'
import useTherapistStore from '../store/useTherapistStore'

export default function BookingForm({ onClose }) {
  const createBooking = useBookingStore((s) => s.createBooking)
  const therapists = useTherapistStore((s) => s.therapists)
  const [title, setTitle] = useState('New Booking')
  const [therapistId, setTherapistId] = useState(therapists?.[0]?.id || '')
  const [services, setServices] = useState(['Massage'])
  const [room, setRoom] = useState('Room 1')
  const [requestType, setRequestType] = useState('Standard')
  const [clientName, setClientName] = useState('')
  const [start, setStart] = useState(new Date().toISOString())
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const payload = { title, therapistId, services, room, requestType, clientName, start, duration, status: 'confirmed' }
      await createBooking(payload)
      onClose && onClose()
    } catch (err) {
      setError(err?.message || 'Failed')
    } finally { setLoading(false) }
  }

  const addService = () => setServices((s) => [...s, ''])
  const setServiceAt = (i, v) => setServices((s) => { const a = [...s]; a[i] = v; return a })
  const removeServiceAt = (i) => setServices((s) => { const a = [...s]; a.splice(i,1); return a })

  return (
    <div className="booking-form">
      <h3>Create Booking</h3>
      <form onSubmit={handleSubmit}>
        <label>Title<input value={title} onChange={(e)=>setTitle(e.target.value)} /></label>
        <label>Therapist
          <select value={therapistId} onChange={(e)=>setTherapistId(e.target.value)}>
            {therapists.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>

        <label>Services</label>
        <div>
          {services.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input value={s} onChange={(e)=>setServiceAt(idx, e.target.value)} />
              <button type="button" onClick={()=>removeServiceAt(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addService}>Add service</button>
        </div>

        <label>Room<input value={room} onChange={(e)=>setRoom(e.target.value)} /></label>
        <label>Request Type<input value={requestType} onChange={(e)=>setRequestType(e.target.value)} /></label>
        <label>Client<input value={clientName} onChange={(e)=>setClientName(e.target.value)} /></label>
        <label>Start<input type="datetime-local" value={start.slice(0,16)} onChange={(e)=>setStart(new Date(e.target.value).toISOString())} /></label>
        <label>Duration (mins)<input type="number" value={duration} onChange={(e)=>setDuration(Number(e.target.value))} /></label>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>{loading? 'Creating…' : 'Create'}</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
