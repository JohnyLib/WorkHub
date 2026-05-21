'use client'

import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { ProfileCard, ProfileCardSkeleton } from '@/components/profiles/ProfileCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_WORKER_PROFILES } from '@/lib/mock/data'
import { Users, X, Search, Briefcase, Building2 } from 'lucide-react'
import { getWorkerProfilesAction } from '@/lib/supabase/actions'
import Link from 'next/link'

const TYPES = [
  { value: '',        label: 'All',        icon: Users },
  { value: 'master',  label: 'Individual', icon: Briefcase },
  { value: 'company', label: 'Company',    icon: Building2 },
  { value: 'agency',  label: 'Agency',     icon: Users },
]

export default function MastersPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const liveProfiles = await getWorkerProfilesAction()
        setProfiles(liveProfiles.length > 0 ? liveProfiles : MOCK_WORKER_PROFILES)
      } catch {
        setProfiles(MOCK_WORKER_PROFILES)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (typeFilter && p.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.display_name.toLowerCase().includes(q) ||
          p.specializations.some((s: string) => s.toLowerCase().includes(q)) ||
          p.work_areas.some((a: string) => a.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [typeFilter, search, profiles])

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Workers & Companies</span>
        </nav>

        {/* Page hero */}
        <div className="mb-8">
          <p className="section-label">
            <Users className="w-3.5 h-3.5" /> Worker Directory
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Workers & Companies</h1>
          <p className="text-slate-500 text-sm">
            Find skilled tradespeople, companies and agencies for your project
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, trade, or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] hover:border-slate-300 transition-all"
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type filters */}
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all min-h-[44px] ${
                    typeFilter === t.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>

          <span className="self-center text-sm font-medium text-slate-500 ml-auto">
            {loading ? '...' : `${filtered.length} results`}
          </span>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ProfileCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            illustration="workers"
            title="No workers found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {filtered.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
