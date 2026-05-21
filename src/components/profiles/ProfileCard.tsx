'use client'

import Link from 'next/link'
import { MapPin, Globe, Phone, CheckCircle, Users, Building2, Briefcase, Star, Clock } from 'lucide-react'
import type { WorkerProfile } from '@/types'

interface ProfileCardProps {
  profile: WorkerProfile
}

const TYPE_ICONS = {
  master:  Briefcase,
  company: Building2,
  agency:  Users,
}

const TYPE_LABELS = {
  master:  'Individual',
  company: 'Company',
  agency:  'Agency',
}

const TYPE_COLORS = {
  master:  'bg-blue-50 text-blue-700 border-blue-100',
  company: 'bg-violet-50 text-violet-700 border-violet-100',
  agency:  'bg-amber-50 text-amber-700 border-amber-100',
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-500 to-violet-700',
  'from-emerald-500 to-emerald-700',
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-cyan-500 to-cyan-700',
]

function getGradient(name: string) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const TypeIcon  = profile.type ? TYPE_ICONS[profile.type]  : Briefcase
  const typeLabel = profile.type ? TYPE_LABELS[profile.type] : 'Worker'
  const typeColor = profile.type ? TYPE_COLORS[profile.type] : 'bg-slate-100 text-slate-600 border-slate-200'
  const gradient  = getGradient(profile.display_name)

  const initials = profile.display_name
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const hasCscs = profile.certifications?.some((c) => c.toUpperCase().includes('CSCS'))

  return (
    <article className="card p-5 flex flex-col gap-4 group card-interactive">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/masters/${profile.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors truncate">
              {profile.display_name}
            </Link>
            {profile.profile?.is_verified && (
              <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" aria-label="Verified" />
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${typeColor}`}>
              <TypeIcon className="w-3 h-3" />
              {typeLabel}
            </span>
            {hasCscs && (
              <span className="badge badge-cscs mt-1 animate-fade-in text-[10px]">
                🛡️ CSCS Card
              </span>
            )}
          </div>
        </div>

        {/* Availability badge */}
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Available
        </span>
      </div>

      {/* Specializations */}
      {profile.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.specializations.slice(0, 3).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              {s}
            </span>
          ))}
          {profile.specializations.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[11px] rounded-md">
              +{profile.specializations.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{profile.bio}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        {profile.work_areas.length > 0 && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {profile.work_areas.slice(0, 2).join(', ')}
          </span>
        )}
        {profile.website && (
          <span className="flex items-center gap-1 text-blue-500">
            <Globe className="w-3.5 h-3.5" /> Website
          </span>
        )}
        {profile.contact_phone && (
          <span className="flex items-center gap-1 text-emerald-600">
            <Phone className="w-3.5 h-3.5" /> Contact available
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {profile.languages.slice(0, 3).map((l) => (
            <span key={l} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-md border border-blue-100">
              {l}
            </span>
          ))}
        </div>
        <Link
          href={`/masters/${profile.id}`}
          className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all min-h-[36px] flex items-center shadow-sm hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          View Profile
        </Link>
      </div>
    </article>
  )
}

/* ── Skeleton ── */
export function ProfileCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="skeleton w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="skeleton h-5 w-16 rounded-md" />
        <div className="skeleton h-5 w-20 rounded-md" />
        <div className="skeleton h-5 w-14 rounded-md" />
      </div>
      <div className="skeleton h-8 w-full rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex justify-between pt-3 border-t border-slate-100">
        <div className="skeleton h-5 w-16 rounded" />
        <div className="skeleton h-8 w-24 rounded-xl" />
      </div>
    </div>
  )
}
