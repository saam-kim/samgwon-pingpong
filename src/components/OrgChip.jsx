import { getOrg } from '../data/orgs'

export default function OrgChip({ orgId, size = 'md' }) {
  const org = getOrg(orgId)
  if (!org) return null

  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-bold ${sizeClasses}`}
      style={{
        background: 'var(--bg-tertiary)',
        color: `var(${org.colorVar})`,
        border: `1.5px solid color-mix(in srgb, var(${org.colorVar}) 35%, transparent)`,
      }}
    >
      <span aria-hidden="true">{org.emoji}</span>
      {org.label}
    </span>
  )
}
