export function formatTime(ms, { tenths = true } = {}) {
  const safeMs = Math.max(0, ms)
  const totalSeconds = Math.floor(safeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const base = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  if (!tenths) return base
  const tenth = Math.floor((safeMs % 1000) / 100)
  return `${base}.${tenth}`
}
