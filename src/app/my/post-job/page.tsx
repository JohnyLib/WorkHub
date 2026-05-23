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
import { Check, ChevronRight, ChevronLeft, MapPin, Users, Clock, Wrench, Phone, FileText, Eye, Sparkles } from 'lucide-react'
import { createJobAction, getCurrentUserAction } from '@/lib/supabase/actions'
import type { PayType, MessengerType } from '@/types'
import Link from 'next/link'

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
  { label: 'Детали работы',      icon: MapPin },
  { label: 'Оплата и часы',      icon: Clock },
  { label: 'Требования',         icon: FileText },
  { label: 'Контакты и Превью',  icon: Eye },
]

const TOP_PROFESSIONS = [
  { name: 'Carpenter & Joiner', emoji: '🪚' },
  { name: 'Bricklayer', emoji: '🧱' },
  { name: 'Plumber', emoji: '🚰' },
  { name: 'Electrician', emoji: '⚡' },
  { name: 'Painter & Decorator', emoji: '🎨' },
  { name: 'Labourer', emoji: '👷' },
]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center mb-8 bg-slate-50/80 p-4 sm:p-5 rounded-[24px] border border-slate-100/50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const isCompleted = i < current
        const isActive = i === current
        return (
          <div key={i} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className={`w-10 h-10 rounded-[18px] flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-95'
                  : isActive
                  ? 'bg-white text-blue-600 ring-2 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/10 scale-105'
                  : 'bg-white text-slate-400 border border-slate-150'
              }`}>
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap hidden sm:block transition-colors duration-300 ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-slate-650 font-medium' : 'text-slate-400'
              }`}>{s.label}</span>
            </div>
            {i < total - 1 && (
              <div className="flex-grow h-[3px] mx-2 mb-4 sm:mb-5 bg-slate-200/70 rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
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
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-605 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] text-sm font-semibold text-slate-800 placeholder:text-slate-400/80 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-350 min-h-[48px] shadow-sm shadow-slate-100/50'

function LivePreview({ draft }: { draft: JobDraft }) {
  const payLabel = draft.pay_type === 'day' ? '/день' : draft.pay_type === 'hour' ? '/час' : draft.pay_type === 'sqm' ? '/m²' : ''
  const hasData = draft.profession || draft.location_area || draft.pay_rate

  return (
    <div className="sticky top-24">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
        <Eye className="w-4 h-4 text-blue-500 animate-pulse" /> Live Preview
      </p>
      
      {/* Device Bezel */}
      <div className="relative mx-auto max-w-[325px] rounded-[44px] border-[8px] border-slate-900 bg-slate-900 p-2.5 shadow-2xl shadow-slate-900/30 overflow-hidden ring-4 ring-slate-150 transition-transform duration-300 hover:scale-[1.01]">
        {/* Screen Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-850/80 mr-2" />
          <div className="w-10 h-1 bg-slate-850/80 rounded-full" />
        </div>

        {/* Mobile Screen Container */}
        <div className="bg-slate-50 rounded-[34px] overflow-hidden min-h-[490px] p-4 flex flex-col justify-between relative z-10 pt-7">
          {/* Dynamic background blurs */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {!hasData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-2 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 border border-white rounded-[24px] flex items-center justify-center shadow-md mb-4 animate-bounce">
                <Eye className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Создайте вакансию</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed px-4">Заполните поля слева, чтобы увидеть как вакансия будет выглядеть для соискателей.</p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                {/* Header / Brand */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WorkBridge Preview</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-450 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>

                {/* Profession & Name Card */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-[20px] border border-white shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
                      {draft.profession.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                        {draft.profession || 'Профессия'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-bold truncate mt-0.5">{draft.contact_name || 'Имя контакта'}</p>
                    </div>
                  </div>

                  {/* Pay Badge */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-baseline justify-between border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Оплата</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-black text-slate-900">
                        {draft.pay_rate ? `£${draft.pay_rate}` : draft.pay_type === 'negotiable' ? 'Договорная' : '£—'}
                      </span>
                      {draft.pay_rate && <span className="text-[10px] text-slate-400 font-bold">{payLabel}</span>}
                    </div>
                  </div>
                </div>

                {/* Meta Details */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-[20px] border border-white shadow-sm space-y-2.5 text-xs text-slate-600">
                  {draft.location_area && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="font-bold truncate">{draft.location_area}{draft.location_postcode ? ` ${draft.location_postcode}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="font-bold">{draft.workers_count || 1} рабочий(е) требуется</span>
                  </div>
                  {draft.days_per_week && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="font-bold">{draft.days_per_week} дн/нед{draft.hours_paid ? ` · ${draft.hours_paid} ч/день` : ''}</span>
                    </div>
                  )}
                  {draft.tools_provided && (
                    <div className="flex items-center gap-2.5 text-emerald-700 font-bold bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100/50">
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      <span>Инструменты предоставляются</span>
                    </div>
                  )}
                </div>

                {/* Required Documents Checklist */}
                {draft.required_docs.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Требуемые Документы</p>
                    <div className="flex flex-wrap gap-1 p-1 bg-white/50 border border-slate-100 rounded-xl">
                      {draft.required_docs.slice(0, 3).map((d) => (
                        <span key={d} className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold rounded-lg">{d}</span>
                      ))}
                      {draft.required_docs.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg">+{draft.required_docs.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Link Bottom Button */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Предпросмотр</span>
                <span className="text-blue-600">WorkBridge UK</span>
              </div>
            </div>
          )}
        </div>
      </div>
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
  const [user, setUser] = useState<any>(null)

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
        const u = await getCurrentUserAction()
        setUser(u)
        setDraft(() => {
          const merged = { ...DEFAULT, ...savedDraft }
          if (!merged.contact_name && u?.full_name) {
            merged.contact_name = u.full_name
          }
          if (!merged.contact_email && u?.email) {
            merged.contact_email = u.email
          }
          if (!merged.contact_phone && u?.phone) {
            merged.contact_phone = u.phone
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
      if (!draft.profession) e.profession = 'Выберите профессию'
      if (!draft.location_area) e.location_area = 'Введите район или город'
    }
    if (s === 3) {
      if (!draft.contact_name) e.contact_name = 'Имя контакта обязательно'
      if (!draft.contact_phone) e.contact_phone = 'Телефон контакта обязателен'
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
        toast.success('🎉 Вакансия успешно опубликована!')
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
        router.push(`/jobs/${res.id}`)
      } else {
        toast.error(res.error || 'Ошибка при публикации вакансии.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Непредвиденная ошибка.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10 relative">
        {/* Ambient Blur */}
        <div className="absolute top-40 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-650/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex gap-8 items-start relative z-10">
          <Sidebar role={user?.role || 'company'} userName={user?.full_name} userEmail={user?.email} />

          {/* Form Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              <h1 className="text-xl font-bold text-slate-900">Опубликовать вакансию</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

              {/* Main form card */}
              <div className="xl:col-span-3 card p-6 sm:p-8 space-y-6">
                <StepIndicator current={step} total={4} />
                
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                  {(() => { const Icon = STEPS[step].icon; return <Icon className="w-4 h-4 text-blue-600" /> })()}
                  {STEPS[step].label}
                </h2>

                {/* ── Step 1 ── */}
                {step === 0 && (
                  <div className="space-y-5 animate-fade-in-up">
                    <Field label="Выберите профессию *" required error={errors.profession}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        {TOP_PROFESSIONS.map((p) => {
                          const isSelected = draft.profession === p.name
                          return (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => set('profession', p.name)}
                              className={`p-3 text-left border rounded-xl transition-all cursor-pointer flex flex-col justify-between h-[82px] group ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                                  : 'border-slate-150 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-650'
                              }`}
                            >
                              <span className="text-2xl group-hover:scale-110 transition-transform">{p.emoji}</span>
                              <span className="text-xs font-bold truncate block">{p.name}</span>
                            </button>
                          )
                        })}
                      </div>
                      <div className="relative">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Или выберите другую из списка</span>
                        <select 
                          id="job-profession" 
                          value={draft.profession} 
                          onChange={(e) => set('profession', e.target.value)} 
                          className={inputCls}
                        >
                          <option value="">Выберите другую профессию</option>
                          {UK_PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </Field>

                    <Field label="Требуется рабочих *" required>
                      <input 
                        id="job-workers" 
                        type="number" 
                        min={1} 
                        max={100} 
                        value={draft.workers_count}
                        onChange={(e) => set('workers_count', e.target.value)} 
                        className={inputCls} 
                      />
                    </Field>

                    <Field label="Район / Город *" required error={errors.location_area}>
                      <input 
                        id="job-location" 
                        type="text" 
                        placeholder="Например: East London, Manchester" 
                        value={draft.location_area}
                        onChange={(e) => set('location_area', e.target.value)} 
                        className={inputCls} 
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Почтовый индекс (Postcode)">
                        <input 
                          id="job-postcode" 
                          type="text" 
                          placeholder="Например: E1 6RF" 
                          value={draft.location_postcode}
                          onChange={(e) => set('location_postcode', e.target.value)} 
                          className={inputCls} 
                        />
                      </Field>
                      <Field label="Дата начала">
                        <input 
                          id="job-start-date" 
                          type="date" 
                          value={draft.start_date}
                          onChange={(e) => set('start_date', e.target.value)} 
                          className={inputCls} 
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ── Step 2 ── */}
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in-up">
                    <Field label="Тип оплаты" required>
                      <div className="grid grid-cols-2 gap-2">
                        {(['day', 'hour', 'sqm', 'negotiable'] as const).map((pt) => (
                          <button 
                            key={pt} 
                            type="button" 
                            onClick={() => set('pay_type', pt)}
                            className={`px-3 py-3 text-xs sm:text-sm font-bold border-2 rounded-xl transition-all min-h-[52px] cursor-pointer ${
                              draft.pay_type === pt
                                ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                                : 'border-slate-150 text-slate-500 hover:border-slate-350 hover:bg-slate-50'
                            }`}
                          >
                            {pt === 'day' ? '📅 По дням' : pt === 'hour' ? '⏱ По часам' : pt === 'sqm' ? '📐 За м²' : '🤝 Договорная'}
                          </button>
                        ))}
                      </div>
                    </Field>

                    {draft.pay_type !== 'negotiable' && (
                      <Field label="Ставка (£ GBP)">
                        <input 
                          id="job-rate" 
                          type="number" 
                          min={0} 
                          value={draft.pay_rate}
                          onChange={(e) => set('pay_rate', e.target.value)} 
                          className={inputCls} 
                          placeholder="Например: 180" 
                        />
                      </Field>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Дней в неделю">
                        <input 
                          id="job-days" 
                          type="number" 
                          min={1} 
                          max={7} 
                          value={draft.days_per_week}
                          onChange={(e) => set('days_per_week', e.target.value)} 
                          className={inputCls} 
                        />
                      </Field>
                      <Field label="Оплачиваемых часов">
                        <input 
                          id="job-hours" 
                          type="number" 
                          step={0.5} 
                          min={1} 
                          max={24} 
                          value={draft.hours_paid}
                          onChange={(e) => set('hours_paid', e.target.value)} 
                          className={inputCls} 
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ── Step 3 ── */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in-up">
                    <Field label="Необходимые документы">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {REQUIRED_DOCS.uk.map((doc) => {
                          const isSelected = draft.required_docs.includes(doc)
                          return (
                            <button
                              key={doc}
                              type="button"
                              onClick={() => toggleArr('required_docs', doc)}
                              className={`px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all duration-205 min-h-[48px] cursor-pointer ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-50/30 text-amber-900 shadow-sm'
                                  : 'border-slate-150 bg-white hover:border-slate-300 text-slate-650'
                              }`}
                            >
                              <span className="text-xs font-bold">{doc}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-350 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <Field label="СИЗ предоставляется (PPE)">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {PPE_ITEMS.map((item) => {
                          const isSelected = draft.ppe_provided.includes(item)
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleArr('ppe_provided', item)}
                              className={`px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all duration-205 min-h-[48px] cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 shadow-sm'
                                  : 'border-slate-155 bg-white hover:border-slate-300 text-slate-650'
                              }`}
                            >
                              <span className="text-xs font-bold">{item}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-350 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group p-4 bg-slate-50/80 hover:bg-slate-100/50 rounded-xl border border-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          id="tools-provided" 
                          checked={draft.tools_provided}
                          onChange={(e) => set('tools_provided', e.target.checked)}
                          className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer" 
                        />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-wide">
                          Инструменты / Оборудование предоставляется
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Step 4 ── */}
                {step === 3 && (
                  <div className="space-y-5 animate-fade-in-up">
                    <Field label="Имя контакта *" required error={errors.contact_name}>
                      <input 
                        id="job-contact-name" 
                        type="text" 
                        placeholder="Например: Александр" 
                        value={draft.contact_name}
                        onChange={(e) => set('contact_name', e.target.value)} 
                        className={inputCls} 
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Телефон контакта *" required error={errors.contact_phone}>
                        <input 
                          id="job-contact-phone" 
                          type="tel" 
                          placeholder="Например: +44 7911 123456" 
                          value={draft.contact_phone}
                          onChange={(e) => set('contact_phone', e.target.value)} 
                          className={inputCls} 
                        />
                      </Field>
                      <Field label="Email">
                        <input 
                          id="job-contact-email" 
                          type="email" 
                          placeholder="you@example.com" 
                          value={draft.contact_email}
                          onChange={(e) => set('contact_email', e.target.value)} 
                          className={inputCls} 
                        />
                      </Field>
                    </div>

                    <Field label="Связь через мессенджеры">
                      <div className="flex gap-2.5 flex-wrap mt-1">
                        {(['whatsapp', 'telegram', 'viber'] as const).map((m) => (
                          <button 
                            key={m} 
                            type="button" 
                            onClick={() => toggleArr('messengers', m)}
                            className={`px-4 py-2.5 text-xs font-bold border rounded-xl transition-all min-h-[44px] capitalize cursor-pointer ${
                              draft.messengers.includes(m)
                                ? m === 'whatsapp' ? 'bg-green-550 text-white border-green-550 shadow-sm shadow-green-500/20'
                                : m === 'telegram' ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/20'
                                : 'bg-violet-550 text-white border-violet-550 shadow-sm shadow-violet-500/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
                            }`}
                          >
                            {m === 'whatsapp' ? '💬 ' : m === 'telegram' ? '✈️ ' : '📱 '}{m.charAt(0).toUpperCase() + m.slice(1)}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Дополнительные примечания">
                      <textarea 
                        id="job-notes" 
                        rows={4} 
                        placeholder="Напишите любые дополнительные детали, график работы, требования к кандидатам..." 
                        value={draft.extra_notes}
                        onChange={(e) => set('extra_notes', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none bg-white text-slate-800 placeholder:text-slate-400 hover:border-slate-350 transition-all shadow-sm" 
                      />
                    </Field>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                  {step > 0 && (
                    <button 
                      type="button" 
                      onClick={back}
                      className="flex items-center gap-1.5 px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-250 rounded-xl transition-all min-h-[52px] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Назад
                    </button>
                  )}
                  {step < 3 ? (
                    <button 
                      type="button" 
                      onClick={next}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-550 rounded-xl transition-all min-h-[52px] shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
                    >
                      Далее <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={submit} 
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-550 rounded-xl transition-all disabled:opacity-60 min-h-[52px] shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 cursor-pointer"
                    >
                      {submitting ? (
                        <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Публикация…</>
                      ) : (
                        <><Check className="w-4 h-4" /> Опубликовать вакансию</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Live preview panel (desktop mockup) */}
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
