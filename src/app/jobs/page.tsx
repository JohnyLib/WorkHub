'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { JobCard, JobCardSkeleton } from '@/components/jobs/JobCard'
import { JobFilters } from '@/components/jobs/JobFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_JOBS } from '@/lib/mock/data'
import { SearchX, TrendingDown, TrendingUp, Clock, Eye, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { getJobListingsAction, getSavedListingsAction, toggleSaveListingAction } from '@/lib/supabase/actions'
import Link from 'next/link'
import type { JobListing } from '@/types'

interface Filters {
  profession: string
  location: string
  pay_type: string
  min_rate: string
  keyword: string
}

const DEFAULT_FILTERS: Filters = { profession: '', location: '', pay_type: '', min_rate: '', keyword: '' }

type SortKey = 'newest' | 'pay_high' | 'pay_low' | 'views'

const SORT_OPTIONS: { value: SortKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'newest',   label: 'Newest',    icon: Clock },
  { value: 'pay_high', label: 'Pay ↑',     icon: TrendingUp },
  { value: 'pay_low',  label: 'Pay ↓',     icon: TrendingDown },
  { value: 'views',    label: 'Popular',   icon: Eye },
]

export default function JobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortKey>('newest')
  const [filters, setFilters] = useState<Filters>(() => ({
    profession: searchParams?.get('profession') || '',
    location:   searchParams?.get('location') || '',
    pay_type:   searchParams?.get('pay_type') || '',
    min_rate:   searchParams?.get('min_rate') || '',
    keyword:    searchParams?.get('keyword') || '',
  }))

  useEffect(() => {
    async function loadData() {
      try {
        const [liveJobs, savedListings] = await Promise.all([
          getJobListingsAction(),
          getSavedListingsAction(),
        ])
        setJobs(liveJobs.length > 0 ? liveJobs : MOCK_JOBS)
        setSaved(new Set(savedListings.map((s) => s.listing_id)))
      } catch {
        setJobs(MOCK_JOBS)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      // Sync URL params
      const params = new URLSearchParams()
      Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
      router.replace(`/jobs${params.toString() ? `?${params}` : ''}`, { scroll: false })
      return next
    })
  }, [router])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    router.replace('/jobs', { scroll: false })
  }, [router])

  const toggleSave = async (id: string) => {
    try {
      const res = await toggleSaveListingAction(id)
      if (res.success) {
        setSaved((prev) => {
          const next = new Set(prev)
          if (res.saved) { next.add(id); toast.success('Saved!') }
          else { next.delete(id); toast.success('Removed from saved') }
          return next
        })
      } else {
        toast.error('Please log in to save listings.')
      }
    } catch {
      toast.error('Please log in to save listings.')
    }
  }

  const filtered = useMemo(() => {
    let result = jobs.filter((job) => {
      if (filters.profession && !job.profession.toLowerCase().includes(filters.profession.toLowerCase())) return false
      if (filters.location && !job.location_area.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.pay_type && job.pay_type !== filters.pay_type) return false
      if (filters.min_rate && job.pay_rate !== null && job.pay_rate < Number(filters.min_rate)) return false
      if (filters.keyword) {
        const q = filters.keyword.toLowerCase()
        const haystack = `${job.profession} ${job.location_area} ${job.employer_name ?? ''} ${job.extra_notes ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    switch (sort) {
      case 'pay_high': result = [...result].sort((a, b) => (b.pay_rate ?? 0) - (a.pay_rate ?? 0)); break
      case 'pay_low':  result = [...result].sort((a, b) => (a.pay_rate ?? 0) - (b.pay_rate ?? 0)); break
      case 'views':    result = [...result].sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0)); break
      default:         result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return result
  }, [filters, jobs, sort])

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Jobs</span>
        </nav>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Construction Jobs in the UK</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? 'Loading listings…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} available right now`}
          </p>
        </div>

        <div className="flex gap-8 items-start">
          {/* Filters */}
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            resultCount={filtered.length}
          />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Top bar: mobile filter + sort */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap w-full">
              <div className="lg:hidden">
                <JobFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  resultCount={filtered.length}
                />
              </div>
              <div className="relative ml-auto flex items-center min-w-[140px] sm:min-w-0">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="w-full pl-3.5 pr-9 py-2 text-xs font-semibold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[38px] transition-all appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      Sort: {label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Skeleton loading */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                illustration="search"
                title="No jobs found"
                description="Try adjusting your filters or check back later — new listings are added daily."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
                  {filtered.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={saved.has(job.id)}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-slate-400 mt-8">
                  Showing {filtered.length} of {jobs.length} listings
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
