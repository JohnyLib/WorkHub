import Link from 'next/link'
import { Inbox, type LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  icon?: LucideIcon
  illustration?: 'jobs' | 'saved' | 'workers' | 'search' | 'generic'
}

const ILLUSTRATIONS: Record<string, { bg: string; iconBg: string; accent: string }> = {
  jobs:    { bg: 'bg-blue-50', iconBg: 'bg-blue-100', accent: 'text-blue-500' },
  saved:   { bg: 'bg-rose-50', iconBg: 'bg-rose-100', accent: 'text-rose-500' },
  workers: { bg: 'bg-violet-50', iconBg: 'bg-violet-100', accent: 'text-violet-500' },
  search:  { bg: 'bg-amber-50', iconBg: 'bg-amber-100', accent: 'text-amber-500' },
  generic: { bg: 'bg-slate-50', iconBg: 'bg-slate-100', accent: 'text-slate-400' },
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon: Icon = Inbox,
  illustration = 'generic',
}: EmptyStateProps) {
  const style = ILLUSTRATIONS[illustration]

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in-up">
      {/* Layered icon */}
      <div className={`relative w-20 h-20 ${style.bg} rounded-3xl flex items-center justify-center mb-6`}>
        <div className={`w-14 h-14 ${style.iconBg} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${style.accent}`} />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-slate-200" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-white border-2 border-slate-200" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">{description}</p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

export function NoResults({ label = 'No results found' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </div>
  )
}
