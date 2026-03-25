export function logEvent(name, payload = {}) {
  console.log('[event]', name, payload)
}

export function logError(origin, err) {
  console.error('[error]', origin, err?.message || err)
}
