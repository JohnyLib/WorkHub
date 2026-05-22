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

const MESSENGER_META: Record<string, { color: string; bg: string; label: string }> = {
  whatsapp: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  label: 'WA' },
  telegram: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)', label: 'TG' },
  viber:    { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', label: 'VI' },
}

const PAY_ACCENT: Record<string, { border: string; glow: string }> = {
  day:        { border: '#3B82F6', glow: 'rgba(59,130,246,0.12)' },
  hour:       { border: '#8B5CF6', glow: 'rgba(139,92,246,0.12)' },
  sqm:        { border: '#F59E0B', glow: 'rgba(245,158,11,0.12)' },
  negotiable: { border: '#94A3B8', glow: 'rgba(148,163,184,0.08)' },
}

const PROFESSION_COLORS: Record<string, string> = {
  bricklayer: 'prof-bricklayer', electrician: 'prof-electrician',
  plumber: 'prof-plumber',       plasterer: 'prof-plasterer',
  carpenter: 'prof-carpenter',   scaffolder: 'prof-scaffolder',
  groundworker: 'prof-groundworker', roofer: 'prof-roofer', labourer: 'prof-labourer',
}

function getProfClass(p: string) {
  return PROFESSION_COLORS[p.toLowerCase().split(' ')[0]] || 'prof-default'
}
function isNew(d: string) {
  return Date.now() - new Date(d).getTime() < 86_400_000
}

export function JobCard({ job, saved = false, onSave }: JobCardProps) {
  const payLabel = job.pay_type === 'day' ? '/day' : job.pay_type === 'hour' ? '/hr' : job.pay_type === 'sqm' ? '/m²' : ''
  const profClass = getProfClass(job.profession)
  const accent = (job.pay_type ? PAY_ACCENT[job.pay_type] : null) ?? PAY_ACCENT.negotiable
  const jobIsNew = isNew(job.created_at)

  return (
    <article
      className="card flex flex-col gap-0 card-interactive group overflow-hidden"
      style={{ borderLeft: `3px solid ${accent.border}` }}
    >
      {/* Subtle top tint from pay type */}
      <div className="absolute inset-x-0 top-0 h-20 pointer-events-none rounded-t-xl"
        style={{ background: `linear-gradient(180deg, ${accent.glow}, transparent)` }} />

      <div className="relative p-5 flex flex-col gap-3.5">
        {/* ── Header ── */}
        <div className="flex items-start gap-3">
          {/* Profession badge */}
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-base font-black shadow-sm ${profClass}`}>
            {job.profession.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <Link href={`/jobs/${job.id}`}>
                <h2 className="font-heading font-bold text-slate-900 text-[15px] leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.profession}
                </h2>
              </Link>
              {jobIsNew && (
                <span className="badge badge-new text-[9px] px-2 py-0.5">● NEW</span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate font-medium">
              {job.employer_name ?? job.contact_name}
              {job.employer_type && <span className="text-slate-300 ml-1">· {job.employer_type}</span>}
            </p>
          </div>

          {/* Save */}
          {onSave && (
            <button
              aria-label={saved ? 'Unsave job' : 'Save job'}
              onClick={e => { e.preventDefault(); onSave(job.id) }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                saved ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'
              }`}>
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* ── Pay Rate ── */}
        <div className="flex items-baseline gap-2 flex-wrap">
          {job.pay_rate ? (
            <>
              <span className="stat-number text-2xl text-slate-900 group-hover:text-blue-700 transition-colors">
                £{job.pay_rate.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-400">{payLabel}</span>
              {job.pay_type && job.pay_type !== 'negotiable' && (
                <span className="chip chip-blue text-[10px]">
                  {job.pay_type === 'day' ? 'Per Day' : job.pay_type === 'hour' ? 'Per Hour' : 'Per m²'}
                </span>
              )}
            </>
          ) : (
            <span className="text-base font-bold text-slate-500">Negotiable</span>
          )}
        </div>

        {/* ── Meta pills ── */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-100">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            {job.location_area}{job.location_postcode ? ` ${job.location_postcode}` : ''}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-100">
            <Users className="w-3 h-3 text-slate-400 shrink-0" />
            {job.workers_count} needed
          </span>
          {job.days_per_week && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-100">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              {job.days_per_week}d/wk{job.hours_paid ? ` · ${job.hours_paid}h` : ''}
            </span>
          )}
          {job.tools_provided && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold border border-emerald-100">
              <Wrench className="w-3 h-3 shrink-0" /> Tools incl.
            </span>
          )}
          {job.start_date && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-semibold border border-blue-100">
              <Zap className="w-3 h-3 shrink-0" />
              {new Date(job.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {/* ── Required docs ── */}
        {job.required_docs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.required_docs.slice(0, 3).map(doc => (
              <span key={doc} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold rounded-md">
                {doc}
              </span>
            ))}
            {job.required_docs.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded-md border border-slate-100">
                +{job.required_docs.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {job.views_count}
            </span>
            <span>{formatDate(job.created_at)}</span>
            {/* Messenger dots */}
            {job.messengers.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="flex gap-0.5">
                  {job.messengers.map(m => (
                    <span key={m} title={m}
                      className="w-2 h-2 rounded-full"
                      style={{ background: MESSENGER_META[m]?.color ?? '#94A3B8' }} />
                  ))}
                </span>
              </span>
            )}
            {job.payment_method && (
              <span className="flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5" />
                {job.payment_method === 'cash' ? 'Cash' : job.payment_method === 'bank' ? 'Bank' : 'Cash/Bank'}
              </span>
            )}
          </div>

          <Link href={`/jobs/${job.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl transition-all group/btn"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 2px 10px rgba(37,99,235,0.3)' }}>
            View
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Skeleton ── */
export function JobCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4" style={{ borderLeft: '3px solid #E2E8F0' }}>
      <div className="flex items-start gap-3">
        <div className="skeleton w-11 h-11 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="skeleton h-7 w-28 rounded-lg" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-24 rounded-lg" />
        <div className="skeleton h-6 w-16 rounded-lg" />
        <div className="skeleton h-6 w-20 rounded-lg" />
      </div>
      <div className="flex gap-1.5">
        <div className="skeleton h-5 w-16 rounded-md" />
        <div className="skeleton h-5 w-20 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  )
}
