'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import { UK_PROFESSIONS } from '@/lib/constants/professions'
import { REQUIRED_DOCS, PPE_ITEMS } from '@/lib/constants/documents'
import { toast } from 'sonner'
import { Check, ChevronRight, ChevronLeft, MapPin, Users, Clock, Wrench, Phone, FileText, Eye } from 'lucide-react'
import { createJobAction, getCurrentUserAction } from '@/lib/supabase/actions'
import type { PayType, MessengerType } from '@/types'

interface JobDraft {
  profession: string
  workers_count: string
  location_area: string
  location_postcode: string
  pay_type: PayType
  pay_rate: string
  days_per_week: string
  hours_paid: string
  required_docs: string[]
  tools_provided: boolean
  ppe_provided: string[]
  start_date: string
  contact_name: string
  contact_phone: string
  contact_email: string
  messengers: MessengerType[]
  extra_notes: string
}

const DEFAULT: JobDraft = {
  profession: '', workers_count: '1', location_area: '', location_postcode: '',
  pay_type: 'day', pay_rate: '', days_per_week: '', hours_paid: '',
  required_docs: [], tools_provided: false, ppe_provided: [], start_date: '',
  contact_name: '', contact_phone: '', contact_email: '', messengers: [], extra_notes: '',
}

const STORAGE_KEY = 'wb_post_job_draft'

const STEPS = [
  { label: 'Job Details',        icon: MapPin },
  { label: 'Pay & Hours',        icon: Clock },
  { label: 'Requirements',       icon: FileText },
  { label: 'Contact & Preview',  icon: Eye },
]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                i < current
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : i === current
                  ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {i < current ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block ${
                i === current ? 'text-blue-600' : i < current ? 'text-slate-600' : 'text-slate-300'
              }`}>{s.label}</span>
            </div>
            {i < total - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 sm:mb-5 transition-colors ${i < current ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, required, children, error }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[48px] bg-white hover:border-slate-300 transition-all text-slate-800 placeholder:text-slate-400'

// Mini preview card
function LivePreview({ draft }: { draft: JobDraft }) {
  const payLabel = draft.pay_type === 'day' ? '/day' : draft.pay_type === 'hour' ? '/hr' : draft.pay_type === 'sqm' ? '/m²' : ''
  const hasData = draft.profession || draft.location_area || draft.pay_rate

  return (
    <div className="sticky top-20">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Eye className="w-3.5 h-3.5 text-blue-500" /> Live Preview
      </p>
      <div className="card p-5 border-l-4 border-l-blue-400">
        {!hasData ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Eye className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Fill in the form to see a preview</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl prof-default flex items-center justify-center font-bold text-base shrink-0">
                {draft.profession.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-tight">
                  {draft.profession || 'Profession'}
                </p>
                <p className="text-xs text-slate-500">{draft.contact_name || 'Contact Name'}</p>
              </div>
            </div>

            {/* Pay */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                {draft.pay_rate ? `£${draft.pay_rate}` : draft.pay_type === 'negotiable' ? 'Negotiable' : '£—'}
              </span>
              {draft.pay_rate && <span className="text-xs text-slate-400">{payLabel}</span>}
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500">
              {draft.location_area && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {draft.location_area}{draft.location_postcode ? ` ${draft.location_postcode}` : ''}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-slate-400" /> {draft.workers_count || 1} worker(s) needed
              </span>
              {draft.days_per_week && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" /> {draft.days_per_week}d/wk{draft.hours_paid ? ` · ${draft.hours_paid}h/day` : ''}
                </span>
              )}
              {draft.tools_provided && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Wrench className="w-3 h-3" /> Tools provided
                </span>
              )}
              {draft.contact_phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" /> {draft.contact_phone}
                </span>
              )}
            </div>

            {/* Docs */}
            {draft.required_docs.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {draft.required_docs.slice(0, 3).map((d) => (
                  <span key={d} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-md">{d}</span>
                ))}
              </div>
            )}

            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
              Preview · not yet published
            </div>
          </div>
        )}
      </div>

      {/* Auto-save note */}
      <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
        <Check className="w-3 h-3 text-green-500" /> Draft auto-saved locally
      </p>
    </div>
  )
}

export default function PostJobPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<JobDraft>(DEFAULT)
  const [errors, setErrors] = useState<Partial<Record<keyof JobDraft, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const isLoadedRef = useRef(false)

  // Load from localStorage & pre-fill from user profile on mount
  useEffect(() => {
    async function initialize() {
      let savedDraft: Partial<JobDraft> = {}
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          savedDraft = JSON.parse(saved)
        }
      } catch (err) {
        console.error('Error loading draft:', err)
      }

      try {
        const user = await getCurrentUserAction()
        setDraft(() => {
          const merged = { ...DEFAULT, ...savedDraft }
          if (!merged.contact_name && user?.full_name) {
            merged.contact_name = user.full_name
          }
          if (!merged.contact_email && user?.email) {
            merged.contact_email = user.email
          }
          return merged
        })
      } catch (err) {
        console.error('Error loading user profile:', err)
        if (Object.keys(savedDraft).length > 0) {
          setDraft(() => ({ ...DEFAULT, ...savedDraft }))
        }
      } finally {
        isLoadedRef.current = true
      }
    }

    initialize()
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (!isLoadedRef.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {}
  }, [draft])

  const set = (key: keyof JobDraft, val: JobDraft[keyof JobDraft]) =>
    setDraft((d) => ({ ...d, [key]: val }))

  const toggleArr = (key: 'required_docs' | 'ppe_provided' | 'messengers', val: string) => {
    const arr = draft[key] as string[]
    set(key, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])
  }

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof JobDraft, string>> = {}
    if (s === 0) {
      if (!draft.profession) e.profession = 'Select a profession'
      if (!draft.location_area) e.location_area = 'Location is required'
    }
    if (s === 3) {
      if (!draft.contact_name) e.contact_name = 'Contact name is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, 3)) }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const submit = async () => {
    if (!validate(3)) return
    setSubmitting(true)
    try {
      const payload = {
        profession: draft.profession,
        workers_count: Number(draft.workers_count) || 1,
        location_area: draft.location_area,
        location_postcode: draft.location_postcode || undefined,
        pay_type: draft.pay_type,
        pay_rate: draft.pay_rate ? Number(draft.pay_rate) : undefined,
        days_per_week: draft.days_per_week ? Number(draft.days_per_week) : undefined,
        hours_paid: draft.hours_paid ? Number(draft.hours_paid) : undefined,
        required_docs: draft.required_docs,
        tools_provided: draft.tools_provided,
        ppe_provided: draft.ppe_provided,
        start_date: draft.start_date || undefined,
        contact_name: draft.contact_name,
        contact_phone: draft.contact_phone || undefined,
        contact_email: draft.contact_email || undefined,
        messengers: draft.messengers,
        extra_notes: draft.extra_notes || undefined,
      }
      const res = await createJobAction(payload)
      if (res.success) {
        toast.success('🎉 Job listing published successfully!')
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
        router.push(`/jobs/${res.id}`)
      } else {
        toast.error(res.error || 'Failed to publish job listing.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred while publishing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <div className="flex gap-8 items-start">
          <Sidebar role="employer" />

          {/* Form */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 mb-6">Post a Job</h1>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

              {/* Main form card */}
              <div className="xl:col-span-3 card p-6 sm:p-8">
                <StepIndicator current={step} total={4} />
                <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  {(() => { const Icon = STEPS[step].icon; return <Icon className="w-4 h-4 text-blue-500" /> })()}
                  {STEPS[step].label}
                </h2>

                {/* ── Step 1 ── */}
                {step === 0 && (
                  <div className="space-y-5">
                    <Field label="Profession" required error={errors.profession}>
                      <select id="job-profession" value={draft.profession} onChange={(e) => set('profession', e.target.value)} className={inputCls}>
                        <option value="">Select profession</option>
                        {UK_PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Workers Needed" required>
                      <input id="job-workers" type="number" min={1} max={100} value={draft.workers_count}
                        onChange={(e) => set('workers_count', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Location Area" required error={errors.location_area}>
                      <input id="job-location" type="text" placeholder="e.g. East London, Manchester" value={draft.location_area}
                        onChange={(e) => set('location_area', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Postcode">
                      <input id="job-postcode" type="text" placeholder="e.g. E1 6RF" value={draft.location_postcode}
                        onChange={(e) => set('location_postcode', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Start Date">
                      <input id="job-start-date" type="date" value={draft.start_date}
                        onChange={(e) => set('start_date', e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                )}

                {/* ── Step 2 ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <Field label="Pay Type" required>
                      <div className="grid grid-cols-2 gap-2">
                        {(['day', 'hour', 'sqm', 'negotiable'] as const).map((pt) => (
                          <button key={pt} type="button" onClick={() => set('pay_type', pt)}
                            className={`px-3 py-3 text-sm font-bold border-2 rounded-xl transition-all min-h-[52px] ${
                              draft.pay_type === pt
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                            }`}>
                            {pt === 'day' ? '📅 Per Day' : pt === 'hour' ? '⏱ Per Hour' : pt === 'sqm' ? '📐 Per m²' : '🤝 Negotiable'}
                          </button>
                        ))}
                      </div>
                    </Field>
                    {draft.pay_type !== 'negotiable' && (
                      <Field label="Rate (£)">
                        <input id="job-rate" type="number" min={0} value={draft.pay_rate}
                          onChange={(e) => set('pay_rate', e.target.value)} className={inputCls} placeholder="e.g. 180" />
                      </Field>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Days/Week">
                        <input id="job-days" type="number" min={1} max={7} value={draft.days_per_week}
                          onChange={(e) => set('days_per_week', e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Paid Hours/Day">
                        <input id="job-hours" type="number" step={0.5} min={1} max={24} value={draft.hours_paid}
                          onChange={(e) => set('hours_paid', e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ── Step 3 ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <Field label="Required Documents">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {REQUIRED_DOCS.uk.map((doc) => (
                          <button key={doc} type="button" onClick={() => toggleArr('required_docs', doc)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all min-h-[40px] ${
                              draft.required_docs.includes(doc)
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}>
                            {doc}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="PPE Provided">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {PPE_ITEMS.map((item) => (
                          <button key={item} type="button" onClick={() => toggleArr('ppe_provided', item)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all min-h-[40px] ${
                              draft.ppe_provided.includes(item)
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" id="tools-provided" checked={draft.tools_provided}
                        onChange={(e) => set('tools_provided', e.target.checked)}
                        className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer" />
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        Tools / equipment provided
                      </span>
                    </label>
                  </div>
                )}

                {/* ── Step 4 ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <Field label="Contact Name" required error={errors.contact_name}>
                      <input id="job-contact-name" type="text" placeholder="John Smith" value={draft.contact_name}
                        onChange={(e) => set('contact_name', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Phone">
                      <input id="job-contact-phone" type="tel" placeholder="+44 7911 123456" value={draft.contact_phone}
                        onChange={(e) => set('contact_phone', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Email">
                      <input id="job-contact-email" type="email" placeholder="you@example.com" value={draft.contact_email}
                        onChange={(e) => set('contact_email', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Available via">
                      <div className="flex gap-2 flex-wrap mt-1">
                        {(['whatsapp', 'telegram', 'viber'] as const).map((m) => (
                          <button key={m} type="button" onClick={() => toggleArr('messengers', m)}
                            className={`px-4 py-2.5 text-sm font-bold border-2 rounded-xl transition-all min-h-[44px] capitalize ${
                              draft.messengers.includes(m)
                                ? m === 'whatsapp' ? 'bg-green-500 text-white border-green-500'
                                : m === 'telegram' ? 'bg-sky-500 text-white border-sky-500'
                                : 'bg-violet-500 text-white border-violet-500'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}>
                            {m === 'whatsapp' ? '💬 ' : m === 'telegram' ? '✈️ ' : '📱 '}{m.charAt(0).toUpperCase() + m.slice(1)}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Extra Notes">
                      <textarea id="job-notes" rows={4} placeholder="Any additional info for applicants..." value={draft.extra_notes}
                        onChange={(e) => set('extra_notes', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-slate-800 placeholder:text-slate-400 hover:border-slate-300 transition-all" />
                    </Field>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                  {step > 0 && (
                    <button type="button" onClick={back}
                      className="flex items-center gap-1.5 px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[52px]">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={next}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all min-h-[52px] shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="button" onClick={submit} disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all disabled:opacity-60 min-h-[52px] shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5">
                      {submitting ? (
                        <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Publishing…</>
                      ) : (
                        <><Check className="w-4 h-4" /> Publish Listing</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Live preview panel (desktop) */}
              <div className="hidden xl:block xl:col-span-2">
                <LivePreview draft={draft} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
