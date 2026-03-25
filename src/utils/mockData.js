export function generateTherapists(count = 200) {
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({ id: `t${i + 1}`, name: `Therapist ${i + 1}`, gender: Math.random() > 0.5 ? 'male' : 'female' })
  }
  return arr
}

export function generateBookings(therapists, bookingsPerDay = 2000) {
  const slotsPerDay = 24 * 4 // 15-min slots
  const bookings = []
  for (let i = 0; i < bookingsPerDay; i++) {
    const therapist = therapists[Math.floor(Math.random() * therapists.length)]
    const slot = Math.floor(Math.random() * slotsPerDay)
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    start.setMinutes(slot * 15)
    const end = new Date(start.getTime() + (30 + Math.floor(Math.random() * 90)) * 60000)
    bookings.push({ id: `b${i + 1}`, title: `Booking ${i + 1}`, therapistId: therapist.id, start: start.toISOString(), end: end.toISOString(), status: 'confirmed' })
  }
  return bookings
}
