import React, { useMemo, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import useBookingStore from '../store/useBookingStore'
import useTherapistStore from '../store/useTherapistStore'
import './calendar.css'

export default function Calendar({ loadMock = false, onSelect = () => {}, query = '' }) {
  const therapists = useTherapistStore((s) => s.therapists)
  const loadTherapists = useTherapistStore((s) => s.loadMock)
  const bookingsAll = useBookingStore((s) => s.bookings)
  const updateBooking = useBookingStore((s) => s.updateBooking)

  useEffect(() => {
    if (loadMock) {
      loadTherapists(200)
    }
  }, [loadMock, loadTherapists])

  const resources = useMemo(() => therapists.map((t) => ({ id: t.id, title: t.name })), [therapists])

  const events = useMemo(() => {
    const q = (query || '').toLowerCase()
    return bookingsAll
      .filter((b) => {
        if (!q) return true
        return (b.title || '').toLowerCase().includes(q) || (b.clientName || '').toLowerCase().includes(q)
      })
      .map((b) => ({
        id: b.id,
        title: b.title || 'Booking',
        start: b.start,
        end: b.duration ? new Date(new Date(b.start).getTime() + b.duration * 60000).toISOString() : undefined,
        resourceId: b.therapistId,
        // give the event a status-based class so we can color it via CSS
        className: `status-${(b.status || 'confirmed')}`,
      }))
  }, [bookingsAll, query])

  const handleEventDrop = async (info) => {
    try {
      const ev = info.event
      const newStart = ev.start ? ev.start.toISOString() : null
      const newResource = ev.getResources && ev.getResources()[0]
      const therapistId = newResource ? newResource.id : ev.getResourceId ? ev.getResourceId() : ev.extendedProps.resourceId
      if (!ev.id) return
      await updateBooking(ev.id, { therapistId, start: newStart })
    } catch (err) {
      console.error('eventDrop update failed', err)
    }
  }

  const handleEventClick = (info) => {
    const id = info.event.id
    const b = bookingsAll.find((x) => x.id === id)
    if (b) onSelect(b)
  }

  return (
    <div className="calendar-shell">
      <div className="calendar-header">Therapist schedule</div>
      <FullCalendar
        plugins={[resourceTimelinePlugin, interactionPlugin, dayGridPlugin]}
        initialView="resourceTimelineDay"
        initialDate={new Date()}
        headerToolbar={{ left: 'title', center: '', right: 'today prev,next' }}
        resources={resources}
        events={events}
        editable={true}
        selectable={true}
        slotDuration="00:15:00"
  resourceAreaHeaderContent="Therapist"
  resourceAreaWidth={220}
  slotMinWidth={110}
  height={'calc(100vh - 160px)'}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        nowIndicator={true}
      />
    </div>
  )
}
