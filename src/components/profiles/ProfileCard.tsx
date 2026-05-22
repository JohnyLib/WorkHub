'use client'

import Link from 'next/link'
import { MapPin, Globe, Phone, CheckCircle, Users, Building2, Briefcase, ArrowRight } from 'lucide-react'
import type { WorkerProfile } from '@/types'

interface ProfileCardProps { profile: WorkerProfile }

const TYPE_META = {
  master:  { icon: Briefcase,  label: 'Individual', chip: 'chip-blue' },
  company: { icon: Building2,  label: 'Company',    chip: 'chip-violet' },
  agency:  { icon: Users,      label: 'Agency',     chip: 'chip-amber' },
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-700',   'from-violet-500 to-violet-700',
  'from-emerald-500 to-emerald-700', 'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700', 'from-cyan-500 to-cyan-700',
]
const CHIP_COLORS = ['chip-blue', 'chip-violet', 'chip-green', 'chip-amber', 'chip-slate']

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return Math.abs(h)
}

function getGradient(name: string) { return AVATAR_GRADIENTS[hash(name) % AVATAR_GRADIENTS.length] }
function getChipColor(i: number)   { return CHIP_COLORS[i % CHIP_COLORS.length] }

export function ProfileCard({ profile }: ProfileCardProps) {
  const meta      = profile.type ? TYPE_META[profile.type] : TYPE_META.master
  const TypeIcon  = meta.icon
  const gradient  = getGradient(profile.display_name)
  const initials  = profile.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const hasCscs   = profile.certifications?.some(c => c.toUpperCase().includes('CSCS'))

  return (
    <article className="card flex flex-col group card-interactive overflow-hidden">
      {/* Gradient accent top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradient} opacity-70`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* ── Header ── */}
        <div className="flex items-start gap-3">
          {/* Avatar with ring */}
          <div className="relative shrink-0">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200`}>
              {initials}
            </div>
            {profile.profile?.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/masters/${profile.id}`}
              className="font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-[15px] leading-snug line-clamp-1 block">
              {profile.display_name}
            </Link>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className={`chip ${meta.chip} text-[10px]`}>
                <TypeIcon className="w-2.5 h-2.5" /> {meta.label}
              </span>
              {hasCscs && (
                <span className="badge badge-cscs text-[9px] px-2 py-0.5">🛡️ CSCS</span>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span className="text-[10px] font-bold text-emerald-700">Available</span>
          </div>
        </div>

        {/* ── Bio ── */}
        {profile.bio && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{profile.bio}</p>
        )}

        {/* ── Skill chips ── */}
        {profile.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.specializations.slice(0, 4).map((s, i) => (
              <span key={s} className={`chip text-[10px] ${getChipColor(i)}`}>{s}</span>
            ))}
            {profile.specializations.length > 4 && (
              <span className="chip chip-slate text-[10px]">+{profile.specializations.length - 4}</span>
            )}
          </div>
        )}

        {/* ── Meta ── */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {profile.work_areas.length > 0 && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {profile.work_areas.slice(0, 2).join(', ')}
            </span>
          )}
          {profile.website && (
            <span className="flex items-center gap-1.5 text-blue-500 font-medium">
              <Globe className="w-3.5 h-3.5 shrink-0" /> Website
            </span>
          )}
          {profile.contact_phone && (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <Phone className="w-3.5 h-3.5 shrink-0" /> Contact available
            </span>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
          <div className="flex gap-1 flex-wrap">
            {profile.languages.slice(0, 3).map(l => (
              <span key={l} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-semibold rounded-lg border border-slate-100">
                {l}
              </span>
            ))}
          </div>
          <Link href={`/masters/${profile.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 border border-blue-100 group/btn">
            View Profile
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Skeleton ── */
export function ProfileCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-slate-100 to-slate-200" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="skeleton w-14 h-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded-lg" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="skeleton h-8 rounded-lg" />
        <div className="flex gap-1.5">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
        <div className="skeleton h-3 w-2/5 rounded" />
        <div className="flex justify-between pt-3 border-t border-slate-100">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-8 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
