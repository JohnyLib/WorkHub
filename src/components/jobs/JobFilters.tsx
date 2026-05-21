'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { ProfessionCombobox } from '@/components/shared/ProfessionCombobox'
import { LocationInput } from '@/components/shared/LocationInput'

interface Filters {
  profession: string
  location: string
  pay_type: string
  min_rate: string
  keyword: string
}

interface JobFiltersProps {
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  onReset: () => void
  resultCount?: number
}

const PAY_TYPES = [
  { value: '',           label: 'Any',        color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { value: 'day',        label: 'Per Day',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'hour',       label: 'Per Hour',   color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { value: 'sqm',        label: 'Per m²',     color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'negotiable', label: 'Negotiable', color: 'bg-slate-100 text-slate-600 border-slate-200' },
]

export function JobFilters({ filters, onFilterChange, onReset, resultCount }: JobFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeCount = Object.entries(filters).filter(([, v]) => Boolean(v)).length

  const filterContent = (
    <div className="space-y-5">
      {/* Keyword */}
      <div>
        <label htmlFor="filter-keyword" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Keyword
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            id="filter-keyword"
            type="text"
            value={filters.keyword}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
            placeholder="Search any keyword..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] transition-all hover:border-slate-300"
          />
          {filters.keyword && (
            <button
              aria-label="Clear keyword"
              onClick={() => onFilterChange('keyword', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Profession */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Profession
        </label>
        <ProfessionCombobox
          id="filter-profession"
          value={filters.profession}
          onChange={(val) => onFilterChange('profession', val)}
          placeholder="All Professions"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Location
        </label>
        <LocationInput
          id="filter-location"
          value={filters.location}
          onChange={(val) => onFilterChange('location', val)}
          placeholder="e.g. London, Manchester"
        />
      </div>

      {/* Pay type pills */}
      <div>
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Pay Type
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PAY_TYPES.map((pt) => {
            const active = filters.pay_type === pt.value
            return (
              <button
                key={pt.value}
                onClick={() => onFilterChange('pay_type', active ? '' : pt.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  active
                    ? pt.color + ' ring-2 ring-offset-1 ring-blue-400'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {pt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Min Rate */}
      <div>
        <label htmlFor="filter-min-rate" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Min Rate (£)
        </label>
        <input
          id="filter-min-rate"
          type="number"
          min={0}
          value={filters.min_rate}
          onChange={(e) => onFilterChange('min_rate', e.target.value)}
          placeholder="e.g. 150"
          className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] transition-all hover:border-slate-300"
        />
      </div>

      {/* Reset */}
      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 rounded-xl transition-all min-h-[44px]"
        >
          <X className="w-4 h-4" />
          Clear All Filters ({activeCount})
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              Filters
            </h2>
            {resultCount !== undefined && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {resultCount} jobs
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          id="mobile-filter-btn"
          onClick={() => setMobileOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all min-h-[44px] ${
            activeCount > 0
              ? 'border-blue-600 text-blue-600 bg-blue-50'
              : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Mobile Sheet */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative bg-white rounded-t-3xl p-6 max-h-[88vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                  Filters
                </h2>
                <button
                  aria-label="Close filters"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              {filterContent}
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full mt-6 px-4 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors min-h-[52px] shadow-lg shadow-blue-600/25"
              >
                Show {resultCount !== undefined ? `${resultCount} Results` : 'Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
