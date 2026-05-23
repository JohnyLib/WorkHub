'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { 
  Building2, Landmark, HardHat, Home, ArrowRight, ArrowLeft, 
  Mail, Lock, User, Phone, Globe, MapPin, CheckCircle, Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { UK_PROFESSIONS } from '@/lib/constants/professions'

// --- Definitions and Schemas ---
type Role = 'company' | 'agency' | 'worker' | 'private'

const baseSchema = {
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}

const companySchema = z.object({
  ...baseSchema,
  company_name: z.string().min(2, 'Company name is required'),
  company_type: z.string().min(1, 'Select company type'),
  contact_name: z.string().min(2, 'Contact name is required'),
  contact_position: z.string().min(2, 'Position is required'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(3, 'Postcode is required'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  company_size: z.string().min(1, 'Select company size'),
  founded_year: z.number().min(1800, 'Enter a valid year').max(new Date().getFullYear()),
  website: z.string().url('Enter a valid URL (with http:// or https://)').optional().or(z.literal('')),
})

const agencySchema = z.object({
  ...baseSchema,
  agency_name: z.string().min(2, 'Agency name is required'),
  contact_name: z.string().min(2, 'Contact name is required'),
  contact_position: z.string().min(2, 'Position is required'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  contract_types: z.array(z.string()).min(1, 'Select at least one contract type'),
  specializations: z.array(z.string()).min(1, 'Select at least one specialization'),
  regions: z.array(z.string()).min(1, 'Select at least one region'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  registration_number: z.string().min(2, 'Registration / REC license number is required'),
  website: z.string().url('Enter a valid URL (with http:// or https://)').optional().or(z.literal('')),
})

const workerSchema = z.object({
  ...baseSchema,
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  profession: z.string().min(1, 'Select your main profession'),
  experience: z.string().min(1, 'Select your experience level'),
  work_cities: z.array(z.string()).min(1, 'Select at least one city'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
})

const privateSchema = z.object({
  ...baseSchema,
  full_name: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  city: z.string().min(2, 'City is required'),
})

// --- Options List ---
const LANG_OPTIONS = ['English', 'Russian', 'Polish', 'Romanian', 'Lithuanian', 'Ukrainian', 'Bulgarian']
const SIZE_OPTIONS = ['1-10 workers', '11-50 workers', '51-200 workers', '200+ workers']
const CONTRACT_OPTIONS = ['CIS', 'PAYE', 'Limited', 'Self-employed', 'Subcontract']
const REGION_OPTIONS = ['London', 'South East', 'South West', 'Midlands', 'East of England', 'North West', 'North East', 'Yorkshire', 'Scotland', 'Wales']
const CITY_OPTIONS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Glasgow', 'Liverpool', 'Sheffield']
const EXPERIENCE_OPTIONS = ['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']

function InputField({ label, id, error, type = 'text', ...props }: {
  label: string; id: string; error?: string; type?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all min-h-[48px] ${
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-200'
            : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function MultiSelect({ label, error, options, selected, onChange }: {
  label: string; error?: string; options: string[]; selected: string[]; onChange: (items: string[]) => void
}) {
  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item))
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
        {options.map((opt) => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleItem(opt)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function RegisterPageInner() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isRegisteredNeedVerify, setIsRegisteredNeedVerify] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const supabase = createClient()
  const router = useRouter()

  // Use separate useForm hooks for each role type to ensure type safety
  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: { languages: ['English'], company_size: '1-10 workers', company_type: 'Ltd', founded_year: 2020, website: '' }
  })

  const agencyForm = useForm<z.infer<typeof agencySchema>>({
    resolver: zodResolver(agencySchema),
    defaultValues: { contract_types: ['CIS'], specializations: [], regions: ['London'], languages: ['English'], website: '' }
  })

  const workerForm = useForm<z.infer<typeof workerSchema>>({
    resolver: zodResolver(workerSchema),
    defaultValues: { work_cities: ['London'], languages: ['English'], profession: '', experience: '' }
  })

  const privateForm = useForm<z.infer<typeof privateSchema>>({
    resolver: zodResolver(privateSchema),
    defaultValues: { full_name: '', phone: '', city: '' }
  })

  const CARDS = [
    {
      id: 'company' as Role,
      emoji: '🏢',
      title: 'Компания',
      subtitle: 'Employer Company',
      desc: 'Публикуйте полные вакансии и нанимайте бригады напрямую.',
      color: 'border-blue-200 hover:border-blue-500 bg-blue-50/20 text-blue-600 shadow-blue-500/5',
      accent: 'blue',
      props: [
        'Публикация подробных вакансий',
        'Прямая связь с рабочими без посредников',
        'Управление портфолио компании'
      ],
      forWho: 'Для строительных фирм, субподрядчиков и девелоперов'
    },
    {
      id: 'agency' as Role,
      emoji: '🏛',
      title: 'Агентство',
      subtitle: 'Recruitment Agency',
      desc: 'Нанимайте персонал и публикуйте вакансии от имени клиентов.',
      color: 'border-violet-200 hover:border-violet-500 bg-violet-50/20 text-violet-600 shadow-violet-500/5',
      accent: 'violet',
      props: [
        'Массовый подбор персонала',
        'Размещение вакансий для клиентов',
        'Отображение официального статуса REC'
      ],
      forWho: 'Для кадровых агентств и поставщиков рабочей силы'
    },
    {
      id: 'worker' as Role,
      emoji: '👷',
      title: 'Рабочий',
      subtitle: 'Tradesman / Worker',
      desc: 'Создайте профессиональное CV и находите лучшие объекты.',
      color: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/20 text-emerald-600 shadow-emerald-500/5',
      accent: 'emerald',
      props: [
        'Создание цифрового CV с CSCS/UTR',
        'Прямой контакт с работодателями',
        '100% бесплатно навсегда'
      ],
      forWho: 'Для мастеров, бригадиров и разнорабочих'
    },
    {
      id: 'private' as Role,
      emoji: '🏠',
      title: 'Частник',
      subtitle: 'Private Client',
      desc: 'Размещайте короткие заявки на разовые задачи в доме или квартире.',
      color: 'border-orange-200 hover:border-orange-500 bg-orange-50/20 text-orange-600 shadow-orange-500/5',
      accent: 'orange',
      props: [
        'Размещение заявки за 2 минуты',
        'Поиск мастеров на ремонт и мелкие задачи',
        'Никаких сложных требований'
      ],
      forWho: 'Для хозяев квартир, коттеджей и заказчиков услуг'
    }
  ]

  const onRegisterSubmit = async (data: any) => {
    try {
      const email = data.email
      const password = data.password
      
      // Structure the metadata fields exactly so the DB trigger pick them up
      const meta: Record<string, any> = {
        role: selectedRole,
        country: 'uk',
        phone: data.phone,
        full_name: data.company_name || data.agency_name || data.full_name || 'User',
      }

      if (selectedRole === 'company') {
        Object.assign(meta, {
          company_name: data.company_name,
          company_type: data.company_type,
          contact_name: data.contact_name,
          contact_position: data.contact_position,
          city: data.city,
          postcode: data.postcode,
          languages: data.languages,
          company_size: data.company_size,
          founded_year: data.founded_year,
          website: data.website
        })
      } else if (selectedRole === 'agency') {
        Object.assign(meta, {
          agency_name: data.agency_name,
          contact_name: data.contact_name,
          contact_position: data.contact_position,
          contract_types: data.contract_types,
          specializations: data.specializations,
          regions: data.regions,
          languages: data.languages,
          registration_number: data.registration_number,
          website: data.website
        })
      } else if (selectedRole === 'worker') {
        Object.assign(meta, {
          profession: data.profession,
          experience: data.experience,
          work_cities: data.work_cities,
          languages: data.languages
        })
      } else if (selectedRole === 'private') {
        Object.assign(meta, {
          city: data.city
        })
      }

      const { data: resData, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: meta }
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (resData.user && !resData.session) {
        setIsRegisteredNeedVerify(true)
        setRegisteredEmail(email)
        toast.success('Registration successful! Please verify your email.')
      } else {
        toast.success('Account created! Welcome to WorkBridge.')
        
        // Redirect according to role
        if (selectedRole === 'company' || selectedRole === 'agency') {
          router.push('/my/listings?welcome=1')
        } else if (selectedRole === 'worker') {
          router.push('/my/profile?welcome=1')
        } else if (selectedRole === 'private') {
          router.push('/my/short-work?welcome=1')
        }
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      toast.error('An unexpected error occurred.')
    }
  }

  if (isRegisteredNeedVerify) {
    return (
      <div className="text-center py-10 max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Mail className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        <div>
          <h3 className="font-heading font-black text-slate-900 text-2xl">Пожалуйста, подтвердите email</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Мы отправили ссылку для активации аккаунта на адрес <strong className="text-slate-800">{registeredEmail}</strong>. 
            Пожалуйста, перейдите по ссылке в письме, чтобы войти в личный кабинет.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 leading-normal">
          ⚠️ <strong>Не пришло письмо?</strong> Проверьте папку «Спам» или подождите 1-2 минуты.
        </div>
        <button
          onClick={() => setIsRegisteredNeedVerify(false)}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-bold"
        >
          ← Вернуться к регистрации
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative z-10 animate-fade-in-up">
      {/* Header Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl shadow-blue-500/30 mb-4">
          <HardHat className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading font-black text-3xl text-slate-900">
          {step === 1 ? 'Создать аккаунт WorkBridge' : `Регистрация: ${CARDS.find(c => c.id === selectedRole)?.title}`}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {step === 1 ? 'Выберите тип учетной записи, чтобы начать работу' : 'Заполните обязательные поля формы регистрации'}
        </p>
      </div>

      {step === 1 ? (
        /* STEP 1: SELECT ACCOUNT TYPE */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARDS.map((card) => {
              const isSelected = selectedRole === card.id
              const activeCls = isSelected 
                ? 'border-blue-600 ring-4 ring-blue-100/50 scale-[1.02] bg-white' 
                : 'border-slate-200 bg-white hover:scale-[1.01]'
              
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedRole(card.id)}
                  className={`text-left p-6 border-2 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[380px] group ${activeCls}`}
                >
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl">
                      {card.emoji}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                      {card.title}
                      {isSelected && <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{card.subtitle}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{card.desc}</p>
                    
                    <ul className="mt-5 space-y-2.5">
                      {card.props.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 w-full">
                    <p className="text-[10px] font-bold text-slate-400 leading-normal">{card.forWho}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-xs text-slate-500 font-medium">Уже зарегистрированы? <Link href="/login" className="text-blue-600 hover:underline font-bold">Войти в кабинет</Link></p>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedRole}
              className="px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer active:scale-95"
            >
              Продолжить <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: SHOW CORRESPONDING FORM */
        <div className="max-w-2xl mx-auto card p-6 sm:p-8 bg-white border border-slate-100 shadow-xl">
          {/* Back button */}
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Назад к выбору
          </button>

          {/* Company Form */}
          {selectedRole === 'company' && (
            <form onSubmit={companyForm.handleSubmit(onRegisterSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Email адрес" id="co-email" type="email" placeholder="you@company.com" error={companyForm.formState.errors.email?.message} {...companyForm.register('email')} />
                <InputField label="Пароль" id="co-password" type="password" placeholder="Мин. 6 символов" error={companyForm.formState.errors.password?.message} {...companyForm.register('password')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Название компании" id="co-name" placeholder="Например Ltd, PLC" error={companyForm.formState.errors.company_name?.message} {...companyForm.register('company_name')} />
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Тип компании</label>
                  <select className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[48px]" {...companyForm.register('company_type')}>
                    <option value="Ltd">Limited Company (Ltd)</option>
                    <option value="PLC">Public Limited Company (PLC)</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Sole Trader">Sole Trader / Contractor</option>
                  </select>
                  {companyForm.formState.errors.company_type && <p className="mt-1 text-xs text-red-500 font-semibold">{companyForm.formState.errors.company_type.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Имя контакта" id="co-contact" placeholder="Иван Иванов" error={companyForm.formState.errors.contact_name?.message} {...companyForm.register('contact_name')} />
                <InputField label="Должность" id="co-pos" placeholder="Директор / Менеджер" error={companyForm.formState.errors.contact_position?.message} {...companyForm.register('contact_position')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <InputField label="Телефон" id="co-phone" placeholder="+44 7911 123456" error={companyForm.formState.errors.phone?.message} {...companyForm.register('phone')} />
                </div>
                <InputField label="Город" id="co-city" placeholder="Лондон" error={companyForm.formState.errors.city?.message} {...companyForm.register('city')} />
                <InputField label="Почтовый индекс (Postcode)" id="co-postcode" placeholder="EC1A 1BB" error={companyForm.formState.errors.postcode?.message} {...companyForm.register('postcode')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Размер компании</label>
                  <select className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[48px]" {...companyForm.register('company_size')}>
                    {SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <InputField label="Год основания" id="co-founded" type="number" placeholder="2020" error={companyForm.formState.errors.founded_year?.message} {...companyForm.register('founded_year', { valueAsNumber: true })} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <InputField label="Веб-сайт компании (Необязательно)" id="co-web" placeholder="https://mycompany.com" error={companyForm.formState.errors.website?.message} {...companyForm.register('website')} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <MultiSelect
                  label="Языки общения компании"
                  options={LANG_OPTIONS}
                  selected={companyForm.watch('languages') || []}
                  onChange={(langs) => companyForm.setValue('languages', langs, { shouldValidate: true })}
                  error={companyForm.formState.errors.languages?.message}
                />
              </div>

              <button
                type="submit"
                disabled={companyForm.formState.isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
              >
                {companyForm.formState.isSubmitting ? 'Создание аккаунта компании...' : 'Зарегистрировать компанию'}
              </button>
            </form>
          )}

          {/* Agency Form */}
          {selectedRole === 'agency' && (
            <form onSubmit={agencyForm.handleSubmit(onRegisterSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Email адрес" id="ag-email" type="email" placeholder="you@agency.com" error={agencyForm.formState.errors.email?.message} {...agencyForm.register('email')} />
                <InputField label="Пароль" id="ag-password" type="password" placeholder="Мин. 6 символов" error={agencyForm.formState.errors.password?.message} {...agencyForm.register('password')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Название агентства" id="ag-name" placeholder="Super Recruitment Ltd" error={agencyForm.formState.errors.agency_name?.message} {...agencyForm.register('agency_name')} />
                </div>
                <InputField label="Номер лицензии / REC" id="ag-rec" placeholder="REC-12345" error={agencyForm.formState.errors.registration_number?.message} {...agencyForm.register('registration_number')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Имя контакта" id="ag-contact" placeholder="Алексей Смирнов" error={agencyForm.formState.errors.contact_name?.message} {...agencyForm.register('contact_name')} />
                <InputField label="Должность контакта" id="ag-pos" placeholder="Руководитель отдела" error={agencyForm.formState.errors.contact_position?.message} {...agencyForm.register('contact_position')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Телефон" id="ag-phone" placeholder="+44 7911 123456" error={agencyForm.formState.errors.phone?.message} {...agencyForm.register('phone')} />
                <InputField label="Веб-сайт агентства" id="ag-web" placeholder="https://agency.com" error={agencyForm.formState.errors.website?.message} {...agencyForm.register('website')} />
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Типы трудовых договоров"
                  options={CONTRACT_OPTIONS}
                  selected={agencyForm.watch('contract_types') || []}
                  onChange={(types) => agencyForm.setValue('contract_types', types, { shouldValidate: true })}
                  error={agencyForm.formState.errors.contract_types?.message}
                />

                <MultiSelect
                  label="Специализация по профессиям"
                  options={UK_PROFESSIONS.slice(0, 12)}
                  selected={agencyForm.watch('specializations') || []}
                  onChange={(specs) => agencyForm.setValue('specializations', specs, { shouldValidate: true })}
                  error={agencyForm.formState.errors.specializations?.message}
                />

                <MultiSelect
                  label="Регионы подбора персонала"
                  options={REGION_OPTIONS}
                  selected={agencyForm.watch('regions') || []}
                  onChange={(regs) => agencyForm.setValue('regions', regs, { shouldValidate: true })}
                  error={agencyForm.formState.errors.regions?.message}
                />

                <MultiSelect
                  label="Языки общения рекрутеров"
                  options={LANG_OPTIONS}
                  selected={agencyForm.watch('languages') || []}
                  onChange={(langs) => agencyForm.setValue('languages', langs, { shouldValidate: true })}
                  error={agencyForm.formState.errors.languages?.message}
                />
              </div>

              <button
                type="submit"
                disabled={agencyForm.formState.isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
              >
                {agencyForm.formState.isSubmitting ? 'Регистрация агентства...' : 'Зарегистрировать агентство'}
              </button>
            </form>
          )}

          {/* Worker Form */}
          {selectedRole === 'worker' && (
            <form onSubmit={workerForm.handleSubmit(onRegisterSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Email адрес" id="wr-email" type="email" placeholder="you@worker.com" error={workerForm.formState.errors.email?.message} {...workerForm.register('email')} />
                <InputField label="Пароль" id="wr-password" type="password" placeholder="Мин. 6 символов" error={workerForm.formState.errors.password?.message} {...workerForm.register('password')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Ваше Имя и Фамилия" id="wr-name" placeholder="Николай Сидоров" error={workerForm.formState.errors.full_name?.message} {...workerForm.register('full_name')} />
                <InputField label="Контактный телефон" id="wr-phone" placeholder="+44 7911 123456" error={workerForm.formState.errors.phone?.message} {...workerForm.register('phone')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Основная профессия</label>
                  <select className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[48px]" {...workerForm.register('profession')}>
                    <option value="">-- Выбрать профессию --</option>
                    {UK_PROFESSIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {workerForm.formState.errors.profession && <p className="mt-1 text-xs text-red-500 font-semibold">{workerForm.formState.errors.profession.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Опыт работы в Великобритании</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <label key={opt} className="relative cursor-pointer">
                        <input type="radio" value={opt} {...workerForm.register('experience')} className="sr-only peer" />
                        <div className="text-center px-2 py-2.5 text-xs font-bold border border-slate-200 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 text-slate-500 hover:border-slate-300 transition-all">
                          {opt}
                        </div>
                      </label>
                    ))}
                  </div>
                  {workerForm.formState.errors.experience && <p className="mt-1.5 text-xs text-red-500 font-semibold">{workerForm.formState.errors.experience.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <MultiSelect
                  label="Города для работы"
                  options={CITY_OPTIONS}
                  selected={workerForm.watch('work_cities') || []}
                  onChange={(cities) => workerForm.setValue('work_cities', cities, { shouldValidate: true })}
                  error={workerForm.formState.errors.work_cities?.message}
                />

                <MultiSelect
                  label="Языки, на которых вы общаетесь"
                  options={LANG_OPTIONS}
                  selected={workerForm.watch('languages') || []}
                  onChange={(langs) => workerForm.setValue('languages', langs, { shouldValidate: true })}
                  error={workerForm.formState.errors.languages?.message}
                />
              </div>

              <button
                type="submit"
                disabled={workerForm.formState.isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
              >
                {workerForm.formState.isSubmitting ? 'Регистрация профиля...' : 'Зарегистрироваться как Рабочий'}
              </button>
            </form>
          )}

          {/* Private Form */}
          {selectedRole === 'private' && (
            <form onSubmit={privateForm.handleSubmit(onRegisterSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Email адрес" id="pr-email" type="email" placeholder="myhome@example.com" error={privateForm.formState.errors.email?.message} {...privateForm.register('email')} />
                <InputField label="Пароль" id="pr-password" type="password" placeholder="Мин. 6 символов" error={privateForm.formState.errors.password?.message} {...privateForm.register('password')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Ваше Имя" id="pr-name" placeholder="Николай" error={privateForm.formState.errors.full_name?.message} {...privateForm.register('full_name')} />
                <InputField label="Контактный телефон" id="pr-phone" placeholder="+44 7911 123456" error={privateForm.formState.errors.phone?.message} {...privateForm.register('phone')} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <InputField label="Город" id="pr-city" placeholder="Лондон" error={privateForm.formState.errors.city?.message} {...privateForm.register('city')} />
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 font-bold bg-orange-50/50 border border-orange-100 rounded-xl py-3 px-4 text-orange-700">
                  🏠 Вот и всё — опубликуй первую заявку за 2 минуты!
                </p>
              </div>

              <button
                type="submit"
                disabled={privateForm.formState.isSubmitting}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
              >
                {privateForm.formState.isSubmitting ? 'Регистрация аккаунта...' : 'Зарегистрироваться как Частник'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F5F3FF 100%)' }}>
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #DBEAFE, transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #EDE9FE, transparent 70%)' }} />
        
        <Suspense>
          <RegisterPageInner />
        </Suspense>
      </main>
    </>
  )
}
