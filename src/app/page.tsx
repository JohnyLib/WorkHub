'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { JobCard, JobCardSkeleton } from '@/components/jobs/JobCard'
import { MOCK_JOBS, MOCK_WORKER_PROFILES } from '@/lib/mock/data'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import { getJobListingsAction, getWorkerProfilesAction } from '@/lib/supabase/actions'
import type { JobListing, WorkerProfile } from '@/types'
import {
  Search, MapPin, ArrowRight, Star, CheckCircle,
  ChevronRight, TrendingUp, Users, Briefcase, Zap, Shield,
  Clock, Building2, PlusCircle, Sparkles, Award
} from 'lucide-react'
import { UK_PROFESSIONS } from '@/lib/constants/professions'
import { ProfessionCombobox } from '@/components/shared/ProfessionCombobox'
import { LocationInput } from '@/components/shared/LocationInput'

/* ── Types ── */
interface StatItem { label: string; value: string; suffix?: string; icon: React.ElementType; color: string }

/* ── Animated counter ── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800; const steps = 60; let step = 0
        const timer = setInterval(() => {
          step++
          setCurrent(Math.round(target * step / steps))
          if (step >= steps) { clearInterval(timer); setCurrent(target) }
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{current.toLocaleString()}{suffix}</span>
}

const STATS: StatItem[] = [
  { label: 'Active Jobs',      value: '2400',  suffix: '+', icon: Briefcase, color: '#3B82F6' },
  { label: 'Verified Workers', value: '8700',  suffix: '+', icon: Users,     color: '#8B5CF6' },
  { label: 'Cities Covered',   value: '85',    suffix: '',  icon: MapPin,    color: '#10B981' },
  { label: 'Jobs Filled',      value: '24000', suffix: '+', icon: Award,     color: '#F59E0B' },
]

const HOW_IT_WORKS = [
  { step: 1, title: 'Post Your Job',        icon: PlusCircle,  gradient: 'from-blue-500 to-blue-600',    desc: 'Free listing in under 5 minutes. Choose profession, location & pay rate.' },
  { step: 2, title: 'Receive Applications', icon: Users,       gradient: 'from-violet-500 to-violet-600', desc: 'Qualified workers contact you directly by phone or messaging app.' },
  { step: 3, title: 'Hire & Get Started',   icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600', desc: 'Confirm your hire and start the project. No middleman, no commission.' },
]

const TESTIMONIALS = [
  {
    name: 'James T.', role: 'Site Foreman · London',
    avatar: 'JT', gradient: 'from-blue-500 to-blue-700',
    text: 'Found three solid bricklayers through WorkBridge within 24 hours. The direct contact system saved us so much time compared to agencies.',
    rating: 5,
  },
  {
    name: 'Oleksandr K.', role: 'Plasterer · Manchester',
    avatar: 'OK', gradient: 'from-violet-500 to-violet-700',
    text: 'As a tradesman, this platform is exactly what I needed. Real jobs, real pay rates, and I talk directly to the employer. Brilliant.',
    rating: 5,
  },
  {
    name: 'BuildRight Ltd', role: 'Building Company · Birmingham',
    avatar: 'BR', gradient: 'from-emerald-500 to-emerald-700',
    text: "We've hired over 20 workers through WorkBridge this year. The quality is excellent and the platform is genuinely free — no hidden charges.",
    rating: 5,
  },
]

const UK_CITIES = [
  { name: 'London',     emoji: '🏙️', count: '840+' },
  { name: 'Manchester', emoji: '🌆', count: '310+' },
  { name: 'Birmingham', emoji: '🏗️', count: '275+' },
  { name: 'Leeds',      emoji: '🌉', count: '190+' },
  { name: 'Bristol',    emoji: '🌁', count: '165+' },
  { name: 'Glasgow',    emoji: '🏛️', count: '140+' },
  { name: 'Liverpool',  emoji: '⚓', count: '155+' },
  { name: 'Sheffield',  emoji: '🔩', count: '120+' },
]

const TRUST_FEATURES = [
  { icon: Shield,      label: 'Secure & Encrypted', sub: 'SSL protected' },
  { icon: CheckCircle, label: 'Verified Profiles',  sub: 'ID checked workers' },
  { icon: Clock,       label: 'Posted Daily',        sub: 'Fresh jobs every day' },
  { icon: Briefcase,   label: 'Zero Fees',           sub: 'Always free to use' },
]

const FEATURED_PROFESSIONS = UK_PROFESSIONS.slice(0, 10)

/* ── Page ── */
export default function HomePage() {
  const router = useRouter()
  const [profession, setProfession] = useState('')
  const [location, setLocation]     = useState('')
  const [jobs, setJobs]             = useState<JobListing[]>([])
  const [workers, setWorkers]       = useState<WorkerProfile[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [j, w] = await Promise.all([getJobListingsAction(), getWorkerProfilesAction()])
        setJobs(j.length > 0 ? j : MOCK_JOBS)
        setWorkers(w.length > 0 ? w : MOCK_WORKER_PROFILES)
      } catch { setJobs(MOCK_JOBS); setWorkers(MOCK_WORKER_PROFILES) }
      finally  { setLoading(false) }
    }
    load()
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (profession) p.set('profession', profession)
    if (location)   p.set('location', location)
    router.push(`/jobs${p.toString() ? `?${p}` : ''}`)
  }

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">

        {/* ════════════════════ HERO ════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 pt-16 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #060B18 0%, #0A1628 45%, #0F2040 75%, #13306A 100%)' }}
        >
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full pointer-events-none animate-float"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', animationDuration: '8s' }} />
          <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full pointer-events-none animate-float"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 60%)' }} />

          {/* Mesh grid */}
          <div className="absolute inset-0 mesh-grid pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">

            {/* Live badge */}
            <div className="flex items-center gap-2 mb-7 animate-fade-in-down">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold"
                style={{ background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.35)', color: '#93C5FD' }}>
                <span className="live-dot" />
                UK&apos;s #1 Construction Job Platform
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[64px] leading-[1.08] tracking-tight mb-5 animate-fade-in-up">
              Find Construction Work<br />
              <span className="gradient-text-hero">Across the UK</span>
            </h1>

            <p className="text-blue-100/70 text-base sm:text-lg max-w-xl mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Connect directly with employers and skilled tradespeople. No agencies, no fees — real construction jobs posted every day.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch}
              className="w-full max-w-2xl glass-premium rounded-2xl p-2 flex flex-col sm:flex-row gap-2 animate-fade-in-up mb-6 shadow-2xl"
              style={{ animationDelay: '0.15s' }}>
              <ProfessionCombobox
                value={profession} onChange={setProfession}
                placeholder="All Professions" variant="hero"
                className="flex-1" id="hero-profession"
              />
              <div className="w-px bg-slate-200/60 hidden sm:block my-2" />
              <LocationInput
                value={location} onChange={setLocation}
                placeholder="Location (e.g. London)" variant="hero"
                className="flex-1" id="hero-location"
              />
              <button type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-sm rounded-xl transition-all duration-200 min-h-[52px] cursor-pointer hover:-translate-y-0.5 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 20px rgba(37,99,235,0.5)' }}>
                <Search className="w-4 h-4" /> Search Jobs
              </button>
            </form>

            {/* Profession quick links */}
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {FEATURED_PROFESSIONS.map((p) => (
                <Link key={p} href={`/jobs?profession=${encodeURIComponent(p)}`}
                  className="px-3.5 py-1.5 text-[11px] font-semibold rounded-full transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float opacity-50" style={{ animationDuration: '3s' }}>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2.5 rounded-full bg-white/40 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ════════════════════ STATS ════════════════════ */}
        <section style={{ background: 'linear-gradient(180deg, #13306A 0%, #F0F4FB 100%)' }} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
              {STATS.map((s) => {
                const Icon = s.icon
                const numTarget = parseInt(s.value.replace(/,/g, ''))
                return (
                  <div key={s.label} className="card p-6 text-center group">
                    <div className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}>
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <p className="stat-number text-3xl mb-1" style={{ color: s.color }}>
                      <AnimatedNumber target={numTarget} suffix={s.suffix} />
                    </p>
                    <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════ FEATURED JOBS ════════════════════ */}
        <section className="py-20 bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label"><TrendingUp className="w-3.5 h-3.5" /> Latest Listings</p>
                <h2 className="font-heading font-bold text-3xl text-slate-900">Recently Posted Jobs</h2>
              </div>
              <Link href="/jobs" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group">
                View all <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : (
              // Mobile: horizontal scroll; Desktop: 3-col grid
              <>
                {/* Mobile horizontal scroll */}
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:hidden">
                  {jobs.slice(0, 6).map(job => (
                    <div key={job.id} className="min-w-[320px] snap-start">
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
                {/* Desktop grid */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5 stagger">
                  {jobs.slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </>
            )}

            <div className="text-center mt-10">
              <Link href="/jobs" className="btn-primary">
                Browse All Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════ HOW IT WORKS ════════════════════ */}
        <section id="how" className="py-24 bg-white relative overflow-hidden">
          {/* Background orb */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <p className="section-label mx-auto"><Zap className="w-3.5 h-3.5" /> Simple Process</p>
              <h2 className="font-heading font-bold text-3xl text-slate-900 mb-3">How WorkBridge Works</h2>
              <p className="text-slate-500 max-w-lg mx-auto">Connect with tradespeople or employers in three simple steps — no registration required to browse.</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Connector */}
              <div className="hidden md:block absolute top-14 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px"
                style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', opacity: 0.3, filter: 'blur(4px)' }} />
              </div>

              {HOW_IT_WORKS.map(({ step, title, icon: Icon, gradient, desc }) => (
                <div key={step} className="relative flex flex-col items-center text-center gap-5 animate-fade-in-up" style={{ animationDelay: `${step * 0.12}s` }}>
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl text-white z-10 relative`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-slate-900 text-xs font-black border-2 border-slate-100 shadow-md flex items-center justify-center z-20">
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ BY CITY ════════════════════ */}
        <section className="py-20 bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="section-label mx-auto"><MapPin className="w-3.5 h-3.5" /> Browse by Location</p>
              <h2 className="font-heading font-bold text-3xl text-slate-900">Find Jobs in Your City</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
              {UK_CITIES.map(({ name, emoji, count }) => (
                <Link key={name} href={`/jobs?location=${encodeURIComponent(name)}`}
                  className="card p-4 flex items-center gap-3 hover:border-blue-200 group transition-all">
                  <span className="text-2xl">{emoji}</span>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{name}</p>
                    <p className="text-xs text-slate-400 font-medium">{count} jobs</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 ml-auto transition-colors group-hover:translate-x-0.5 duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-label mx-auto"><Star className="w-3.5 h-3.5" /> Trusted Reviews</p>
              <h2 className="font-heading font-bold text-3xl text-slate-900">Trusted by Thousands</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="card p-6 flex flex-col gap-5 relative overflow-hidden">
                  {/* Large quote mark */}
                  <span className="absolute top-3 right-4 font-heading text-7xl text-slate-50 font-black leading-none select-none pointer-events-none">&ldquo;</span>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 relative z-10">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-black shadow-md shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ FEATURED WORKERS ════════════════════ */}
        <section className="py-20 bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label"><Users className="w-3.5 h-3.5" /> Worker Profiles</p>
                <h2 className="font-heading font-bold text-3xl text-slate-900">Available Tradespeople</h2>
              </div>
              <Link href="/masters" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group">
                View all <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {workers.slice(0, 3).map(w => <ProfileCard key={w.id} profile={w} />)}
            </div>
            <div className="text-center mt-10">
              <Link href="/masters" className="btn-ghost">
                Browse All Workers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════ CTA SECTION ════════════════════ */}
        <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #060B18 0%, #0F2040 40%, #1D4ED8 80%, #7C3AED 100%)' }}>
          <div className="absolute inset-0 mesh-grid pointer-events-none" />
          {/* Orbs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full pointer-events-none animate-float"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)', animationDuration: '7s' }} />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full pointer-events-none animate-float"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', animationDuration: '9s', animationDelay: '2s' }} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 border"
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
              Looking to Hire <br className="hidden sm:block" />Tradespeople?
            </h2>
            <p className="text-blue-100/70 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Post a free job listing and receive direct applications from skilled workers in your area. No agency fees, ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/my/post-job" className="btn-white">
                <Sparkles className="w-5 h-5" /> Post a Job — Free
              </Link>
              <Link href="/masters" className="btn-outline-white">
                <Users className="w-5 h-5" /> Browse Workers
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-blue-100/60">
              {['Free to post', 'No commission', 'Direct contact', 'Goes live instantly'].map(f => (
                <span key={f} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ TRUST BAR ════════════════════ */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {TRUST_FEATURES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
