'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { 
  Save, Sparkles, Check, Phone, ArrowLeft, Building2, Users, Landmark, ShieldCheck 
} from 'lucide-react'
import { PhotoUpload } from '@/components/profiles/PhotoUpload'
import { UK_PROFESSIONS } from '@/lib/constants/professions'
import Sidebar from '@/components/layout/Sidebar'
import { 
  upsertWorkerProfileAction,
  upsertCompanyProfileAction,
  upsertAgencyProfileAction,
  upsertPrivateProfileAction
} from '@/lib/supabase/actions'
import { WorkerType } from '@/types'

const LANG_OPTIONS = ['English', 'Russian', 'Polish', 'Romanian', 'Lithuanian', 'Ukrainian', 'Bulgarian']
const SIZE_OPTIONS = ['1-10 workers', '11-50 workers', '51-200 workers', '200+ workers']
const CONTRACT_OPTIONS = ['CIS', 'PAYE', 'Limited', 'Self-employed', 'Subcontract']
const REGION_OPTIONS = ['London', 'South East', 'South West', 'Midlands', 'East of England', 'North West', 'North East', 'Yorkshire', 'Scotland', 'Wales']
const CITY_OPTIONS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Glasgow', 'Liverpool', 'Sheffield']
const EXPERIENCE_OPTIONS = ['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']

const inputCls = 'w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] text-sm font-semibold text-slate-800 placeholder:text-slate-400/80 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-350 min-h-[48px] shadow-sm shadow-slate-100/50'
const selectCls = 'w-full px-4 py-3.5 bg-white border border-slate-200 rounded-[16px] text-sm font-semibold text-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-350 min-h-[48px] shadow-sm'

function InputField({ label, id, error, type = 'text', ...props }: {
  label: string; id: string; error?: string; type?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        id={id}
        type={type}
        className={`${inputCls} ${error ? 'border-red-400 bg-red-50 focus:ring-red-200' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (items: string[]) => void
}) {
  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item))
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50/50 border border-slate-100 rounded-[20px] max-h-[160px] overflow-y-auto">
        {options.map((opt) => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleItem(opt)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface EditProfileClientProps {
  user: any
  workerProfile: any
  companyProfile: any
  agencyProfile: any
  privateProfile: any
}

export default function EditProfileClient({
  user,
  workerProfile,
  companyProfile,
  agencyProfile,
  privateProfile
}: EditProfileClientProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  // 1. Worker Profile Fields
  const [workerType, setWorkerType] = useState<WorkerType>(workerProfile?.type || 'master')
  const [workerName, setWorkerName] = useState(workerProfile?.display_name || user.full_name || '')
  const [workerPhone, setWorkerPhone] = useState(workerProfile?.contact_phone || '')
  const [workerProfession, setWorkerProfession] = useState(workerProfile?.profession || '')
  const [workerExperience, setWorkerExperience] = useState(workerProfile?.experience || '')
  const [workerCities, setWorkerCities] = useState<string[]>(workerProfile?.work_cities || ['London'])
  const [workerLanguages, setWorkerLanguages] = useState<string[]>(workerProfile?.languages || ['English'])
  const [workerBio, setWorkerBio] = useState(workerProfile?.bio || '')

  // 2. Company Profile Fields
  const [companyName, setCompanyName] = useState(companyProfile?.company_name || user.full_name || '')
  const [companyType, setCompanyType] = useState(companyProfile?.company_type || 'Ltd')
  const [companyContactName, setCompanyContactName] = useState(companyProfile?.contact_name || user.full_name || '')
  const [companyContactPosition, setCompanyContactPosition] = useState(companyProfile?.contact_position || '')
  const [companyPhone, setCompanyPhone] = useState(companyProfile?.phone || '')
  const [companyCity, setCompanyCity] = useState(companyProfile?.city || '')
  const [companyPostcode, setCompanyPostcode] = useState(companyProfile?.postcode || '')
  const [companySize, setCompanySize] = useState(companyProfile?.company_size || '1-10 workers')
  const [companyFoundedYear, setCompanyFoundedYear] = useState<number>(companyProfile?.founded_year || 2020)
  const [companyWebsite, setCompanyWebsite] = useState(companyProfile?.website || '')
  const [companyBio, setCompanyBio] = useState(companyProfile?.description || '')
  const [companyLanguages, setCompanyLanguages] = useState<string[]>(companyProfile?.languages || ['English'])

  // 3. Agency Profile Fields
  const [agencyName, setAgencyName] = useState(agencyProfile?.agency_name || user.full_name || '')
  const [agencyContactName, setAgencyContactName] = useState(agencyProfile?.contact_name || user.full_name || '')
  const [agencyContactPosition, setAgencyContactPosition] = useState(agencyProfile?.contact_position || '')
  const [agencyPhone, setAgencyPhone] = useState(agencyProfile?.phone || '')
  const [agencyWebsite, setAgencyWebsite] = useState(agencyProfile?.website || '')
  const [agencyRegNumber, setAgencyRegNumber] = useState(agencyProfile?.registration_number || '')
  const [agencyBio, setAgencyBio] = useState(agencyProfile?.description || '')
  const [agencyContractTypes, setAgencyContractTypes] = useState<string[]>(agencyProfile?.contract_types || ['CIS'])
  const [agencySpecializations, setAgencySpecializations] = useState<string[]>(agencyProfile?.specializations || [])
  const [agencyRegions, setAgencyRegions] = useState<string[]>(agencyProfile?.regions || ['London'])
  const [agencyLanguages, setAgencyLanguages] = useState<string[]>(agencyProfile?.languages || ['English'])

  // 4. Private Profile Fields
  const [privateName, setPrivateName] = useState(privateProfile?.display_name || user.full_name || '')
  const [privatePhone, setPrivatePhone] = useState(privateProfile?.phone || '')
  const [privateCity, setPrivateCity] = useState(privateProfile?.city || '')

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      let res: { success: boolean; id?: string; error?: string }

      if (user.role === 'worker') {
        if (!workerName) { toast.error('Введите Ваше Имя'); setSubmitting(false); return }
        if (!workerPhone) { toast.error('Укажите контактный телефон'); setSubmitting(false); return }
        if (!workerProfession) { toast.error('Выберите Вашу профессию'); setSubmitting(false); return }

        res = await upsertWorkerProfileAction({
          type: workerType,
          display_name: workerName,
          bio: workerBio,
          specializations: [workerProfession],
          work_areas: workerCities,
          contact_phone: workerPhone,
          profession: workerProfession,
          experience: workerExperience,
          work_cities: workerCities,
        })
      } else if (user.role === 'company') {
        if (!companyName) { toast.error('Введите название компании'); setSubmitting(false); return }
        if (!companyPhone) { toast.error('Укажите контактный телефон'); setSubmitting(false); return }
        if (!companyContactName) { toast.error('Введите имя контакта'); setSubmitting(false); return }

        res = await upsertCompanyProfileAction({
          company_name: companyName,
          company_type: companyType,
          contact_name: companyContactName,
          contact_position: companyContactPosition,
          phone: companyPhone,
          city: companyCity,
          postcode: companyPostcode,
          company_size: companySize,
          founded_year: Number(companyFoundedYear),
          website: companyWebsite,
          description: companyBio,
          languages: companyLanguages,
        })
      } else if (user.role === 'agency') {
        if (!agencyName) { toast.error('Введите название агентства'); setSubmitting(false); return }
        if (!agencyPhone) { toast.error('Укажите контактный телефон'); setSubmitting(false); return }
        if (!agencyContactName) { toast.error('Введите имя рекрутера'); setSubmitting(false); return }

        res = await upsertAgencyProfileAction({
          agency_name: agencyName,
          contact_name: agencyContactName,
          contact_position: agencyContactPosition,
          phone: agencyPhone,
          website: agencyWebsite,
          registration_number: agencyRegNumber,
          description: agencyBio,
          contract_types: agencyContractTypes,
          specializations: agencySpecializations,
          regions: agencyRegions,
          languages: agencyLanguages,
        })
      } else if (user.role === 'private') {
        if (!privateName) { toast.error('Введите Ваше Имя'); setSubmitting(false); return }
        if (!privatePhone) { toast.error('Укажите контактный телефон'); setSubmitting(false); return }

        res = await upsertPrivateProfileAction({
          display_name: privateName,
          phone: privatePhone,
          city: privateCity,
        })
      } else {
        toast.error('Неизвестная роль пользователя')
        setSubmitting(false)
        return
      }

      if (res.success) {
        toast.success('Профиль успешно сохранен!')
        router.push('/my/profile')
        router.refresh()
      } else {
        toast.error(res.error || 'Не удалось сохранить профиль.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Произошла непредвиденная ошибка.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex gap-8 items-start relative z-10">
      <Sidebar role={user?.role || 'worker'} userName={user?.full_name} userEmail={user?.email} />

      <div className="flex-1 min-w-0 max-w-2xl">
        {/* Back link */}
        <Link href="/my/profile" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-455 hover:text-slate-700 transition-colors uppercase tracking-wider mb-5 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Назад в кабинет
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          <h1 className="text-xl font-bold text-slate-900">Редактировать профиль</h1>
        </div>

        <div className="card p-6 sm:p-8 space-y-6 bg-white border border-slate-100 shadow-xl">

          {/* ────────────────── WORKER FORM ────────────────── */}
          {user?.role === 'worker' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-[20px] p-4 flex items-start gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-850">Вы редактируете анкету Специалиста (Мастера)</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 leading-snug">Ваша анкета будет отображаться в списке мастеров для прямых заказов работодателями.</p>
                </div>
              </div>

              {/* Worker Sub-type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Тип мастера</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'master', label: 'Частный мастер', desc: 'Работаю один' },
                    { id: 'agency', label: 'Бригада / Фирма', desc: 'Работаем командой' }
                  ].map(opt => (
                    <label key={opt.id} className="relative cursor-pointer">
                      <input type="radio" checked={workerType === opt.id} onChange={() => setWorkerType(opt.id as WorkerType)} className="sr-only peer" />
                      <div className="px-4 py-3 border border-slate-200 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50/50 peer-checked:text-blue-700 hover:border-slate-350 transition-all text-center">
                        <p className="text-xs font-bold">{opt.label}</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <InputField label="Ваше Имя / Фамилия *" id="wr-name" value={workerName} onChange={(e) => setWorkerName(e.target.value)} placeholder="Виктор Петров" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="wr-profession" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Основная профессия *</label>
                  <select id="wr-profession" value={workerProfession} onChange={(e) => setWorkerProfession(e.target.value)} className={selectCls}>
                    <option value="">-- Выбрать --</option>
                    {UK_PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="wr-exp" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Опыт работы в UK</label>
                  <select id="wr-exp" value={workerExperience} onChange={(e) => setWorkerExperience(e.target.value)} className={selectCls}>
                    <option value="">-- Выбрать --</option>
                    {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <InputField label="Контактный Телефон *" id="wr-phone" type="tel" value={workerPhone} onChange={(e) => setWorkerPhone(e.target.value)} placeholder="+44 7911 123456" />

              <MultiSelect label="Города для работы" options={CITY_OPTIONS} selected={workerCities} onChange={setWorkerCities} />
              <MultiSelect label="Языки общения" options={LANG_OPTIONS} selected={workerLanguages} onChange={setWorkerLanguages} />

              <div className="space-y-1.5">
                <label htmlFor="wr-bio" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">О себе / Навыки</label>
                <textarea id="wr-bio" rows={4} value={workerBio} onChange={(e) => setWorkerBio(e.target.value)} placeholder="Расскажите о своем строительном опыте, инструментах, наличии CSCS/UTR..." className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none hover:border-slate-350 transition-all shadow-sm" />
              </div>

              {/* Portfolio upload widget */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Фотографии Ваших Работ (Портфолио)</label>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-[20px]">
                  {user.id ? (
                    <PhotoUpload workerProfileId={workerProfile?.id || null} userId={user.id} />
                  ) : (
                    <div className="animate-pulse bg-slate-200 rounded-xl h-24 flex items-center justify-center text-xs text-slate-400">
                      Загрузка фото-виджета...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── COMPANY FORM ────────────────── */}
          {user?.role === 'company' && (
            <div className="space-y-5">
              <div className="bg-blue-50/50 border border-blue-100/60 rounded-[20px] p-4 flex items-start gap-3 mb-2">
                <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-850">Вы редактируете профиль Компании-Работодателя</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5 leading-snug">Заполненный профиль повышает доверие рабочих и ускоряет подбор на Ваши вакансии.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Название компании *" id="co-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Stellar Builds Ltd" />
                <div className="space-y-1.5">
                  <label htmlFor="co-type" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Тип юр. лица</label>
                  <select id="co-type" value={companyType} onChange={(e) => setCompanyType(e.target.value)} className={selectCls}>
                    <option value="Ltd">Limited Company (Ltd)</option>
                    <option value="PLC">Public Limited Company (PLC)</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Sole Trader">Sole Trader / Contractor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Имя контакта *" id="co-cont" value={companyContactName} onChange={(e) => setCompanyContactName(e.target.value)} placeholder="Иван Иванов" />
                <InputField label="Должность контакта" id="co-pos" value={companyContactPosition} onChange={(e) => setCompanyContactPosition(e.target.value)} placeholder="HR-директор / Бригадир" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <InputField label="Телефон *" id="co-phone" type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+44 7911 123456" />
                </div>
                <InputField label="Город" id="co-city" value={companyCity} onChange={(e) => setCompanyCity(e.target.value)} placeholder="Лондон" />
                <InputField label="Почтовый Индекс" id="co-post" value={companyPostcode} onChange={(e) => setCompanyPostcode(e.target.value)} placeholder="E1 6AN" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="co-size" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Размер компании</label>
                  <select id="co-size" value={companySize} onChange={(e) => setCompanySize(e.target.value)} className={selectCls}>
                    {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <InputField label="Год основания" id="co-founded" type="number" value={companyFoundedYear} onChange={(e) => setCompanyFoundedYear(Number(e.target.value))} placeholder="2020" />
              </div>

              <InputField label="Веб-сайт компании" id="co-web" type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="https://stellarbuilds.co.uk" />

              <MultiSelect label="Языки общения в компании" options={LANG_OPTIONS} selected={companyLanguages} onChange={setCompanyLanguages} />

              <div className="space-y-1.5">
                <label htmlFor="co-bio" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Описание компании</label>
                <textarea id="co-bio" rows={4} value={companyBio} onChange={(e) => setCompanyBio(e.target.value)} placeholder="Расскажите о проектах компании, условиях труда и стабильности выплат..." className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none hover:border-slate-350 transition-all shadow-sm" />
              </div>
            </div>
          )}

          {/* ────────────────── AGENCY FORM ────────────────── */}
          {user?.role === 'agency' && (
            <div className="space-y-5">
              <div className="bg-violet-50/50 border border-violet-100/60 rounded-[20px] p-4 flex items-start gap-3 mb-2">
                <Users className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-violet-850">Вы редактируете профиль Рекрутингового Агентства</p>
                  <p className="text-[10px] text-violet-600 font-semibold mt-0.5 leading-snug">Агентства могут публиковать вакансии от имени различных клиентов и вести массовый поиск рабочих.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Название агентства *" id="ag-name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Apex Recruiting Ltd" />
                <InputField label="Номер лицензии / REC" id="ag-reg" value={agencyRegNumber} onChange={(e) => setAgencyRegNumber(e.target.value)} placeholder="REC-74929" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Имя рекрутера *" id="ag-cont" value={agencyContactName} onChange={(e) => setAgencyContactName(e.target.value)} placeholder="Алексей Смирнов" />
                <InputField label="Должность" id="ag-pos" value={agencyContactPosition} onChange={(e) => setAgencyContactPosition(e.target.value)} placeholder="Senior Consultant" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Телефон *" id="ag-phone" type="tel" value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)} placeholder="+44 7911 123456" />
                <InputField label="Веб-сайт" id="ag-web" type="url" value={agencyWebsite} onChange={(e) => setAgencyWebsite(e.target.value)} placeholder="https://apexrecruiting.com" />
              </div>

              <MultiSelect label="Договоры (Contract types)" options={CONTRACT_OPTIONS} selected={agencyContractTypes} onChange={setAgencyContractTypes} />
              <MultiSelect label="Специализация по профессиям" options={UK_PROFESSIONS.slice(0, 10)} selected={agencySpecializations} onChange={setAgencySpecializations} />
              <MultiSelect label="Регионы поиска кадров" options={REGION_OPTIONS} selected={agencyRegions} onChange={setAgencyRegions} />
              <MultiSelect label="Языки общения рекрутеров" options={LANG_OPTIONS} selected={agencyLanguages} onChange={setAgencyLanguages} />

              <div className="space-y-1.5">
                <label htmlFor="ag-bio" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Описание агентства</label>
                <textarea id="ag-bio" rows={4} value={agencyBio} onChange={(e) => setAgencyBio(e.target.value)} placeholder="Опишите ваши ключевые преимущества, секторы работы и среднее время трудоустройства..." className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none hover:border-slate-350 transition-all shadow-sm" />
              </div>
            </div>
          )}

          {/* ────────────────── PRIVATE CLIENT FORM ────────────────── */}
          {user?.role === 'private' && (
            <div className="space-y-5">
              <div className="bg-orange-50/50 border border-orange-100/60 rounded-[20px] p-4 flex items-start gap-3 mb-2">
                <Landmark className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-orange-850">Вы редактируете профиль Частного Клиента</p>
                  <p className="text-[10px] text-orange-600 font-semibold mt-0.5 leading-snug">Вы можете нанимать исполнителей на короткие разовые задачи и мелкий бытовой ремонт.</p>
                </div>
              </div>

              <InputField label="Ваше Имя *" id="pr-name" value={privateName} onChange={(e) => setPrivateName(e.target.value)} placeholder="Николай" />
              <InputField label="Контактный Телефон *" id="pr-phone" type="tel" value={privatePhone} onChange={(e) => setPrivatePhone(e.target.value)} placeholder="+44 7911 123456" />
              <InputField label="Ваш Город" id="pr-city" value={privateCity} onChange={(e) => setPrivateCity(e.target.value)} placeholder="Лондон" />
            </div>
          )}

          {/* Save Button Container */}
          <div className="pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-555 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer text-base"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'Сохранение изменений...' : 'Сохранить изменения'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
