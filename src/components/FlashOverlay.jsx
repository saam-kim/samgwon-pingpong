export default function FlashOverlay({ flashKey, type }) {
  if (!type) return null
  return <div key={flashKey} className={`flash-overlay flash-${type}`} aria-hidden="true" />
}
