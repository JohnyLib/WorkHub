'use client'

import { useState, useEffect, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Link from 'next/link'
import { Search, MapPin, Calendar, Clock, ArrowRight, Briefcase } from 'lucide-react'
import { getPublicShortWorkListingsAction } from '@/lib/supabase/actions'

const SERVICES = ['Все', 'Сантехника', 'Электрика', 'Плитка', 'Покраска', 'Ремонт', 'Уборка']
const URGENCY_OPTIONS = [
  { id: 'all', label: 'Любая срочность' },
  { id: 'ASAP', label: 'Срочно (ASAP)' },
  { id: 'this_week', label: 'На этой неделе' },
  { id: 'not_urgent', label: 'Не срочно' },
]

function HourlyFeedInner() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedService, setSelectedService] = useState('Все')
  const [cityFilter, setCityFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')

  async function loadListings() {
    setLoading(true)
    try {
      const filters: any = {}
      if (selectedService !== 'Все') filters.service_type = selectedService
      if (cityFilter) filters.city = cityFilter
      if (urgencyFilter !== 'all') filters.urgency = urgencyFilter

      const res = await getPublicShortWorkListingsAction(filters)
      setListings(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [selectedService, urgencyFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadListings()
  }

  return (
    <div className="w-full relative z-10 animate-fade-in-up">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
          🏠 Разовые задачи от Частников (Short Work)
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mt-4">
          Найдите быструю подработку
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
          Короткие задачи от собственников жилья. Общайтесь напрямую, договаривайтесь о цене и получайте оплату сразу по завершении!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5 bg-white border border-slate-100 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider">Фильтры</h3>
            
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label htmlFor="search-city" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Город</label>
                <div className="relative">
                  <input
                    id="search-city"
                    type="text"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder="Например: Лондон"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Срочность</label>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {URGENCY_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all min-h-[38px] cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10"
              >
                <Search className="w-3.5 h-3.5" /> Применить
              </button>
            </form>
          </div>
        </div>

        {/* Listings List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Service filter horizontal bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {SERVICES.map((srv) => {
              const isSelected = selectedService === srv
              return (
                <button
                  key={srv}
                  onClick={() => setSelectedService(srv)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 scale-105'
                      : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {srv === 'Все' ? '🏠 Все услуги' : srv}
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-100 h-32 rounded-[24px]" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="card p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Ничего не найдено</h3>
              <p className="text-xs text-slate-400">Нет активных заявок по вашему запросу. Попробуйте сбросить фильтры.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 stagger">
              {listings.map((job) => (
                <Link
                  key={job.id}
                  href={`/hourly/${job.id}`}
                  className="card p-5 hover:border-orange-200 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-100 rounded-full">{job.service_type}</span>
                        {job.urgency === 'ASAP' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 rounded-full">Срочно</span>
                        )}
                        {job.urgency === 'this_week' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full">На этой неделе</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-orange-600">
                          {job.budget_type === 'fixed' ? `£${job.budget_amount}` : 'Договорная'}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors mt-3">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-50 text-[11px] text-slate-400 font-semibold flex-wrap gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.city}{job.postcode ? `, ${job.postcode}` : ''}
                      </span>
                      {job.preferred_date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {job.preferred_date}
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 text-orange-600 hover:text-orange-700 transition-colors font-bold cursor-pointer group-hover:translate-x-0.5 duration-200">
                      Подробнее <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HourlyFeedPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-16"
        style={{ background: 'linear-gradient(135deg, #FFFDF9 0%, #FFFBF5 50%, #FAF6F0 100%)' }}>
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F97316, transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #EAB308, transparent 70%)' }} />
        
        <div className="max-w-7xl mx-auto">
          <Suspense>
            <HourlyFeedInner />
          </Suspense>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
