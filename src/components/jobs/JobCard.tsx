'use client'

import Link from 'next/link'
import { MapPin, Users, Wrench, Eye, Clock, Bookmark, ArrowUpRight, MessageCircle, Banknote, Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import type { JobListing } from '@/types'

interface JobCardProps {
  job: JobListing
  saved?: boolean
  onSave?: (id: string) => void
}

const MESSENGER_COLORS: Record<string, string> = {
  whatsapp: '#22C55E',
  telegram: '#0EA5E9',
  viber: '#8B5CF6',
}

const PAY_TYPE_BG: Record<string, string> = {
  day:        'bg-blue-50 text-blue-700 border-blue-100',
  hour:       'bg-violet-50 text-violet-700 border-violet-100',
  sqm:        'bg-amber-50 text-amber-700 border-amber-100',
  negotiable: 'bg-slate-100 text-slate-600 border-slate-200',
}

const PAY_TYPE_ACCENT: Record<string, string> = {
  day:        'border-l-blue-400',
  hour:       'border-l-violet-400',
  sqm:        'border-l-amber-400',
  negotiable: 'border-l-slate-300',
}

// Generate consistent colors per profession
const PROFESSION_COLORS: Record<string, string> = {
  bricklayer: 'prof-bricklayer',
  electrician: 'prof-electrician',
  plumber: 'prof-plumber',
  plasterer: 'prof-plasterer',
  carpenter: 'prof-carpenter',
  scaffolder: 'prof-scaffolder',
  groundworker: 'prof-groundworker',
  roofer: 'prof-roofer',
  labourer: 'prof-labourer',
}

function getProfessionClass(profession: string): string {
  const key = profession.toLowerCase().split(' ')[0]
  return PROFESSION_COLORS[key] || 'prof-default'
}

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  return (now.getTime() - created.getTime()) < 24 * 60 * 60 * 1000
}

export function JobCard({ job, saved = false, onSave }: JobCardProps) {
  const payLabel = job.pay_type === 'day' ? '/day' : job.pay_type === 'hour' ? '/hr' : job.pay_type === 'sqm' ? '/m²' : ''
  const profClass = getProfessionClass(job.profession)
  const accentClass = (job.pay_type ? PAY_TYPE_ACCENT[job.pay_type] : undefined) || 'border-l-slate-300'
  const jobIsNew = isNew(job.created_at)

  return (
    <article className={`card p-4 sm:p-5 flex flex-col gap-3 sm:gap-3.5 group border-l-4 ${accentClass} card-interactive`}>

      {/* ── Header ── */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        {/* Trade icon with profession color */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 text-base sm:text-lg font-bold ${profClass}`}
        >
          {job.profession.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <Link href={`/jobs/${job.id}`}>
              <h2 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.profession}
              </h2>
            </Link>
            {jobIsNew && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                NEW
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">
            {job.employer_name ?? job.contact_name}
            {job.employer_type && (
              <span className="ml-1.5 text-slate-400 capitalize">· {job.employer_type}</span>
            )}
          </p>
        </div>

        {/* Save button */}
        {onSave && (
          <button
            aria-label={saved ? 'Unsave job' : 'Save job'}
            onClick={(e) => { e.preventDefault(); onSave(job.id) }}
            className={`p-2 rounded-lg transition-all min-w-[36px] min-h-[36px] flex items-center justify-center ${
              saved ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* ── Pay Rate ── */}
      <div className="flex flex-wrap items-center gap-2">
        {job.pay_rate ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              £{job.pay_rate.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-400">{payLabel}</span>
          </div>
        ) : (
          <span className="text-sm sm:text-base font-semibold text-slate-500">Negotiable</span>
        )}
        {job.pay_type && job.pay_type !== 'negotiable' && (
          <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border ${PAY_TYPE_BG[job.pay_type]}`}>
            {job.pay_type === 'day' ? 'Per Day' : job.pay_type === 'hour' ? 'Per Hour' : 'Per m²'}
          </span>
        )}
      </div>

      {/* ── Meta ── */}
      <div className="flex flex-wrap gap-x-3.5 gap-y-2 text-[11px] sm:text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium truncate max-w-[120px] sm:max-w-none">{job.location_area}</span>
          {job.location_postcode && <span className="text-slate-400 shrink-0">{job.location_postcode}</span>}
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {job.workers_count} needed
        </span>
        {job.days_per_week && (
          <span className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {job.days_per_week}d/wk
            {job.hours_paid && ` · ${job.hours_paid}h/day`}
          </span>
        )}
        {job.tools_provided && (
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium shrink-0">
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            Tools provided
          </span>
        )}
        {job.start_date && (
          <span className="flex items-center gap-1.5 text-blue-600 font-medium shrink-0">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            Starts {new Date(job.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* ── Document badges ── */}
      {job.required_docs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.required_docs.slice(0, 3).map((doc) => (
            <span key={doc} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-semibold rounded-md">
              {doc}
            </span>
          ))}
          {job.required_docs.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md">
              +{job.required_docs.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-auto flex-wrap gap-2.5">
        <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {job.views_count}
          </span>
          <span>{formatDate(job.created_at)}</span>

          {/* Messenger dots */}
          {job.messengers.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="flex gap-0.5">
                {job.messengers.map((m) => (
                  <span
                    key={m}
                    className="w-2 h-2 rounded-full"
                    style={{ background: MESSENGER_COLORS[m] }}
                    title={m.charAt(0).toUpperCase() + m.slice(1)}
                  />
                ))}
              </span>
            </span>
          )}

          {/* Payment method */}
          {job.payment_method && (
            <span className="flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5" />
              {job.payment_method === 'cash' ? 'Cash' : job.payment_method === 'bank' ? 'Bank' : 'Cash/Bank'}
            </span>
          )}
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all min-h-[34px] shadow-sm hover:shadow-blue-500/30 hover:-translate-y-0.5"
          style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
        >
          View <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  )
}

/* ── Skeleton ── */
export function JobCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-3.5 border-l-4 border-l-slate-200">
      <div className="flex items-start gap-3">
        <div className="skeleton w-11 h-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="skeleton h-8 w-32 rounded" />
      <div className="flex gap-3">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
      <div className="flex gap-1.5">
        <div className="skeleton h-5 w-16 rounded-md" />
        <div className="skeleton h-5 w-20 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-8 w-16 rounded-lg" />
      </div>
    </div>
  )
}
