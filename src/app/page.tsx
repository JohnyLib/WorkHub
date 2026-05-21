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
import {
  HardHat, Search, MapPin, ArrowRight, Star, CheckCircle,
  ChevronRight, TrendingUp, Users, Briefcase, Zap, Shield,
  Clock, Building2, PlusCircle
} from 'lucide-react'
import { UK_PROFESSIONS } from '@/lib/constants/professions'
import { ProfessionCombobox } from '@/components/shared/ProfessionCombobox'
import { LocationInput } from '@/components/shared/LocationInput'

/* ────────────────────────────────── Types */
interface StatItem { label: string; value: string; suffix?: string }

/* ────────────────────────────────── Animated Counter */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1500
          const steps = 60
          let step = 0
          const timer = setInterval(() => {
            step++
            setCurrent(Math.round((target * step) / steps))
            if (step >= steps) { clearInterval(timer); setCurrent(target) }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{current.toLocaleString()}{suffix}</span>
}

const STATS: StatItem[] = [
  { label: 'Active Jobs', value: '2,400', suffix: '+' },
  { label: 'Verified Workers', value: '8,700', suffix: '+' },
  { label: 'Cities Covered', value: '85', suffix: '' },
  { label: 'Jobs Filled', value: '24,000', suffix: '+' },
]

const HOW_IT_WORKS = [
  { step: 1, title: 'Post Your Job',         icon: PlusCircle,  color: 'bg-blue-500',   desc: 'Free listing in under 5 minutes. Choose profession, location & pay.' },
  { step: 2, title: 'Receive Applications',  icon: Users,       color: 'bg-violet-500', desc: 'Qualified workers reach out directly via phone or messaging.' },
  { step: 3, title: 'Hire & Get Started',    icon: CheckCircle, color: 'bg-emerald-500',desc: 'Confirm your hire and start your project. No middleman, no fees.' },
]

const TESTIMONIALS = [
  {
    name: 'James T.',
    role: 'Site Foreman, London',
    avatar: 'JT',
    gradient: 'from-blue-500 to-blue-700',
    text: 'Found three solid bricklayers through WorkBridge within 24 hours. The direct contact system saved us so much time compared to agencies.',
    rating: 5,
  },
  {
    name: 'Oleksandr K.',
    role: 'Plasterer, Manchester',
    avatar: 'OK',
    gradient: 'from-violet-500 to-violet-700',
    text: 'As a tradesman, this platform is exactly what I needed. Real jobs, real pay rates, and I talk directly to the employer. Brilliant.',
    rating: 5,
  },
  {
    name: 'BuildRight Ltd',
    role: 'Building Company, Birmingham',
    avatar: 'BR',
    gradient: 'from-emerald-500 to-emerald-700',
    text: 'We\'ve hired over 20 workers through WorkBridge this year. The quality is excellent and the platform is genuinely free — no hidden charges.',
    rating: 5,
  },
]

const UK_CITIES = [
  { name: 'London',     emoji: '🏙️' },
  { name: 'Manchester', emoji: '🌆' },
  { name: 'Birmingham', emoji: '🏗️' },
  { name: 'Leeds',      emoji: '🌉' },
  { name: 'Bristol',    emoji: '🌁' },
  { name: 'Glasgow',    emoji: '🏛️' },
  { name: 'Liverpool',  emoji: '⚓' },
  { name: 'Sheffield',  emoji: '🔩' },
]

const FEATURED_PROFESSIONS = UK_PROFESSIONS.slice(0, 12)

/* ────────────────────────────────── Page */
export default function HomePage() {
  const router = useRouter()
  const [profession, setProfession] = useState('')
  const [location, setLocation] = useState('')
  const [jobs, setJobs] = useState<any[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [liveJobs, liveWorkers] = await Promise.all([
          getJobListingsAction(),
          getWorkerProfilesAction(),
        ])
        setJobs(liveJobs.length > 0 ? liveJobs : MOCK_JOBS)
        setWorkers(liveWorkers.length > 0 ? liveWorkers : MOCK_WORKER_PROFILES)
      } catch {
        setJobs(MOCK_JOBS)
        setWorkers(MOCK_WORKER_PROFILES)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (profession) params.set('profession', profession)
    if (location) params.set('location', location)
    router.push(`/jobs${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <>
      <Header />
      <main>

        {/* ══════════ HERO ══════════ */}
        <section
          className="relative min-h-[92vh] flex flex-col items-center justify-center text-white px-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F2040 40%, #13306A 100%)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

          {/* Badge */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-down">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border"
              style={{ background: 'rgba(37,99,235,0.2)', borderColor: 'rgba(37,99,235,0.4)', color: '#93C5FD' }}>
              <div className="live-dot" />
              <span>UK&apos;s #1 Construction Jobs Platform</span>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight mb-4 max-w-4xl animate-fade-in-up">
            Find Construction Work
            <span className="block mt-2 gradient-text">Across the UK</span>
          </h1>

          <p className="text-blue-100/80 text-base sm:text-lg text-center max-w-xl mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Connect directly with employers and skilled tradespeople. No agencies, no fees — just real construction jobs posted daily.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 animate-fade-in-up mb-6"
            style={{ animationDelay: '0.15s', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <ProfessionCombobox
              value={profession}
              onChange={setProfession}
              placeholder="All Professions"
              variant="hero"
              className="flex-1"
              id="hero-profession"
            />
            <div className="w-px bg-slate-200 hidden sm:block my-2" />
            <LocationInput
              value={location}
              onChange={setLocation}
              placeholder="Location (e.g. London)"
              variant="hero"
              className="flex-1"
              id="hero-location"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-0.5 min-h-[52px]"
            >
              <Search className="w-4 h-4" /> Search Jobs
            </button>
          </form>

          {/* Quick profession links */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {FEATURED_PROFESSIONS.slice(0, 8).map((p) => (
              <Link key={p} href={`/jobs?profession=${encodeURIComponent(p)}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)' }}>
                {p}
              </Link>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float opacity-60">
            <span className="text-xs text-blue-200">Scroll to explore</span>
            <div className="w-5 h-8 rounded-full border-2 border-blue-300/40 flex items-start justify-center pt-1.5">
              <div className="w-1.5 h-2.5 rounded-full bg-blue-300/60 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        <section className="py-14" style={{ background: 'linear-gradient(180deg, #0F2040 0%, #F8FAFC 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s) => {
                const numericTarget = parseInt(s.value.replace(/,/g, ''))
                return (
                  <div key={s.label} className="card p-6 text-center">
                    <p className="text-3xl font-black text-blue-600 mb-1">
                      <AnimatedNumber target={numericTarget} suffix={s.suffix} />
                    </p>
                    <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════ FEATURED JOBS ══════════ */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label"><TrendingUp className="w-3.5 h-3.5" /> Latest Listings</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Recently Posted Jobs</h2>
              </div>
              <Link href="/jobs" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
                {jobs.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link href="/jobs" className="btn-primary">
                Browse All Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-label mx-auto"><Zap className="w-3.5 h-3.5" /> Simple Process</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How WorkBridge Works</h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Connect with tradespeople or employers in three simple steps — no registration required to search.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5"
                style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }} />

              {HOW_IT_WORKS.map(({ step, title, icon: Icon, color, desc }) => (
                <div key={step} className="relative flex flex-col items-center text-center gap-4 animate-fade-in-up" style={{ animationDelay: `${step * 0.1}s` }}>
                  <div className={`relative w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg text-white z-10`}>
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-slate-900 text-xs font-black border-2 border-slate-100 flex items-center justify-center">
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ BROWSE BY CITY ══════════ */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="section-label mx-auto"><MapPin className="w-3.5 h-3.5" /> By Location</p>
              <h2 className="text-2xl font-bold text-slate-900">Browse Jobs by City</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {UK_CITIES.map(({ name, emoji }) => (
                <Link
                  key={name}
                  href={`/jobs?location=${encodeURIComponent(name)}`}
                  className="card p-4 flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 group transition-all"
                >
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{name}</p>
                    <p className="text-xs text-slate-400">View jobs</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ TESTIMONIALS ══════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-label mx-auto"><Star className="w-3.5 h-3.5" /> Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trusted by Thousands</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="card p-6 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FEATURED WORKERS ══════════ */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label"><Users className="w-3.5 h-3.5" /> Worker Profiles</p>
                <h2 className="text-2xl font-bold text-slate-900">Available Tradespeople</h2>
              </div>
              <Link href="/masters" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {workers.slice(0, 3).map((w) => (
                <ProfileCard key={w.id} profile={w} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/masters" className="btn-ghost">
                Browse All Workers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════ EMPLOYER CTA ══════════ */}
        <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 50%, #7C3AED 100%)' }}>
          <div className="absolute inset-0 animate-gradient pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.5) 0%, rgba(124,58,237,0.5) 100%)', backgroundSize: '200% 200%' }} />
          {/* Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 border"
              style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' }}>
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Looking to Hire Tradespeople?
            </h2>
            <p className="text-blue-100/80 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Post a free job listing and receive direct applications from skilled workers in your area. No agency fees, no subscriptions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/my/post-job"
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold text-base rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 min-h-[56px]">
                <PlusCircle className="w-5 h-5" /> Post a Job — Free
              </Link>
              <Link href="/masters"
                className="flex items-center gap-2 px-8 py-4 font-bold text-base rounded-xl transition-all min-h-[56px] border border-white/30 text-white hover:bg-white/10">
                <Users className="w-5 h-5" /> Browse Workers
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-blue-100/70">
              {['Free to post', 'No commission', 'Direct contact', 'Goes live instantly'].map((f) => (
                <span key={f} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ TRUST BAR ══════════ */}
        <section className="py-10 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-sm text-slate-500">
              {[
                { icon: Shield, text: 'Secure & Encrypted' },
                { icon: CheckCircle, text: 'Verified Profiles' },
                { icon: Clock, text: 'Jobs Posted Daily' },
                { icon: Briefcase, text: 'No Hidden Fees' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-500" /> {text}
                </span>
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
