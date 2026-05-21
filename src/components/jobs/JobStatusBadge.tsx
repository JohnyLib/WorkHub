import type { ListingStatus } from '@/types'

const STATUS_MAP: Record<ListingStatus, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-slate-100 text-slate-600' },
  pending:   { label: 'Pending',   className: 'bg-amber-100 text-amber-700' },
  published: { label: 'Active',    className: 'bg-green-100 text-green-700' },
  expired:   { label: 'Expired',   className: 'bg-red-100 text-red-600' },
}

export function JobStatusBadge({ status }: { status: ListingStatus }) {
  const { label, className } = STATUS_MAP[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
