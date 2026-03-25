import React, { useState, useEffect } from 'react'
import useBookingStore from '../store/useBookingStore'
import useTherapistStore from '../store/useTherapistStore'

export default function BookingPanel({ booking, onClose }) {
  const [editable, setEditable] = useState(false)
  console.log('[bookingPanel] render, booking=', booking && booking.id)
  const updateBooking = useBookingStore((s) => s.updateBooking)
  const cancelBooking = useBookingStore((s) => s.cancelBooking)
  const deleteBooking = useBookingStore((s) => s.deleteBooking)
  const therapists = useTherapistStore((s) => s.therapists)

  const [form, setForm] = useState(null)

  useEffect(() => {
    console.log('[bookingPanel] booking effect', booking && booking.id)
    setForm(booking ? { ...booking, services: booking.services ? [...booking.services] : [booking.service || ''] } : null)
    setEditable(false)
  }, [booking])

  if (!booking || !form) return <div className="booking-panel">Select a booking to see details</div>

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const handleSave = async () => {
    try {
      // normalize services into payload
      const payload = { ...form }
      if (payload.services) payload.service = payload.services[0]
      await updateBooking(booking.id, payload)
      setEditable(false)
      onClose && onClose()
    } catch (err) {
      console.error('save failed', err)
      alert('Failed to save booking')
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this booking?')) return
    try {
      await cancelBooking(booking.id)
      onClose && onClose()
    } catch (err) {
      console.error('cancel failed', err)
      alert('Failed to cancel booking')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this booking permanently?')) return
    try {
      await deleteBooking(booking.id)
      onClose && onClose()
    } catch (err) {
      console.error('delete failed', err)
      alert('Failed to delete booking')
    }
  }

  const addService = () => setForm((s) => ({ ...s, services: [...(s.services || []), ''] }))
  const setServiceAt = (i, v) => setForm((s) => { const arr = [...(s.services||[])]; arr[i] = v; return { ...s, services: arr } })
  const removeServiceAt = (i) => setForm((s) => { const arr = [...(s.services||[])]; arr.splice(i,1); return { ...s, services: arr } })

  return (
    <aside className="booking-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{form.title || 'Booking'}</h3>
        <div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
  <label>Title</label>
  <input className="" value={form.title || ''} onChange={(e) => setField('title', e.target.value)} disabled={!editable} />

        <label>Therapist</label>
        <select value={form.therapistId || ''} onChange={(e) => setField('therapistId', e.target.value)} disabled={!editable}>
          <option value="">— select —</option>
          {therapists.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

  <label>Start</label>
  <input type="datetime-local" value={form.start ? form.start.slice(0,16) : ''} onChange={(e)=>setField('start', new Date(e.target.value).toISOString())} disabled={!editable} />

  <label>Duration (mins)</label>
  <input type="number" value={form.duration || 30} onChange={(e)=>setField('duration', Number(e.target.value))} disabled={!editable} />

        <label>Services</label>
        <div>
          {(form.services||[]).map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input value={s} onChange={(e)=>setServiceAt(idx, e.target.value)} disabled={!editable} />
              {editable && <button type="button" className="btn btn-ghost" onClick={()=>removeServiceAt(idx)}>Remove</button>}
            </div>
          ))}
          {editable && <button className="btn btn-ghost" onClick={addService}>Add service</button>}
        </div>

        <label>Status</label>
        <select value={form.status || 'confirmed'} onChange={(e)=>setField('status', e.target.value)} disabled={!editable}>
          <option value="confirmed">Confirmed</option>
          <option value="checkin">Check-in</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="actions">
          {editable ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
              <button className="btn btn-ghost" onClick={()=>setEditable(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={()=>setEditable(true)}>Edit</button>
          )}
          <button className="btn btn-ghost" onClick={handleCancel}>Cancel Booking</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </aside>
  )
}
