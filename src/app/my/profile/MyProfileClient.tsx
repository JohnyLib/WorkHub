'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, MapPin, Phone, Mail, Shield, Edit3, PlusCircle, Briefcase, Star, CheckCircle2, Sparkles } from 'lucide-react'
import { WelcomeBanner } from '@/components/shared/WelcomeBanner'
import Sidebar from '@/components/layout/Sidebar'

interface MyProfileClientProps {
  user: any
  workerProfile: any
  companyProfile: any
  agencyProfile: any
  privateProfile: any
  myJobs: any[]
}

export default function MyProfileClient({
  user,
  workerProfile,
  companyProfile,
  agencyProfile,
  privateProfile,
  myJobs
}: MyProfileClientProps) {
  // Resolve profile status depending on user role
  let phone = null
  let displayName = user.full_name || 'Без имени'
  let subProfileCreated = false

  if (user.role === 'worker') {
    phone = workerProfile?.contact_phone || null
    displayName = workerProfile?.display_name || user.full_name || 'Специалист'
    subProfileCreated = !!workerProfile
  } else if (user.role === 'company') {
    phone = companyProfile?.phone || null
    displayName = companyProfile?.company_name || user.full_name || 'Компания'
    subProfileCreated = !!companyProfile
  } else if (user.role === 'agency') {
    phone = agencyProfile?.phone || null
    displayName = agencyProfile?.agency_name || user.full_name || 'Агентство'
    subProfileCreated = !!agencyProfile
  } else if (user.role === 'private') {
    phone = privateProfile?.phone || null
    displayName = privateProfile?.display_name || user.full_name || 'Частный клиент'
    subProfileCreated = !!privateProfile
  }

  // Profile completion checklist
  const completionItems = [
    { label: 'Аккаунт зарегистрирован', done: true },
    { label: 'Имя / Название заполнено', done: !!displayName && displayName !== 'Без имени' },
    { label: 'Email подтвержден',  done: !!(user.email) },
    { 
      label: user.role === 'worker' ? 'Профиль специалиста создан' :
             user.role === 'company' ? 'Профиль компании создан' :
             user.role === 'agency' ? 'Профиль агентства создан' : 'Анкета клиента создана',  
      done: subProfileCreated 
    },
    { label: 'Номер телефона заполнен',  done: !!phone },
  ]
  const completedCount = completionItems.filter((i) => i.done).length
  const pct = Math.round((completedCount / completionItems.length) * 100)

  // Role Theme definitions (Gradients and Colors)
  let bannerGradient = 'from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/25'
  let roleBadge = 'bg-blue-50 text-blue-700 border-blue-100'
  let roleLabel = '🏢 Работодатель (Компания)'
  let statsColor = 'text-blue-600'
  let progressColor = 'bg-blue-600'
  let welcomeRole: 'company' | 'agency' | 'worker' | 'private' = 'company'

  if (user.role === 'agency') {
    bannerGradient = 'from-violet-600 via-purple-650 to-fuchsia-600 shadow-violet-500/25'
    roleBadge = 'bg-violet-50 text-violet-750 border-violet-100'
    roleLabel = '🏛 Рекрутинговое Агентство'
    statsColor = 'text-violet-600'
    progressColor = 'bg-violet-600'
    welcomeRole = 'agency'
  } else if (user.role === 'worker') {
    bannerGradient = 'from-emerald-600 via-teal-550 to-cyan-600 shadow-emerald-500/25'
    roleBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100'
    roleLabel = '👷 Специалист (Рабочий)'
    statsColor = 'text-emerald-600'
    progressColor = 'bg-emerald-600'
    welcomeRole = 'worker'
  } else if (user.role === 'private') {
    bannerGradient = 'from-orange-500 via-orange-600 to-amber-600 shadow-orange-500/25'
    roleBadge = 'bg-orange-50 text-orange-700 border-orange-100'
    roleLabel = '🏠 Частный клиент (Хозяин квартиры)'
    statsColor = 'text-orange-600'
    progressColor = 'bg-orange-600'
    welcomeRole = 'private'
  }

  return (
    <div className="flex gap-8 items-start relative z-10">
      <Sidebar
        role={user.role}
        userName={user.full_name || undefined}
        userEmail={user.email}
      />

      <div className="flex-1 min-w-0 max-w-2xl space-y-6">
        
        <WelcomeBanner role={welcomeRole} />

        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-900">Личный кабинет</h1>
          </div>
          <Link 
            href="/my/edit-profile" 
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer min-h-[38px] uppercase tracking-wider"
          >
            <Edit3 className="w-4 h-4" /> Изменить профиль
          </Link>
        </div>

        {/* Premium Mesh Hero Profile Banner */}
        <div className={`relative rounded-[24px] bg-gradient-to-r ${bannerGradient} p-6 sm:p-8 text-white shadow-xl overflow-hidden`}>
          {/* Dynamic light blur circles */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Elevated Glassmorphic Avatar frame */}
            <div className="w-24 h-24 rounded-[28px] bg-white/15 backdrop-blur-md p-1 border border-white/25 shadow-lg relative group transition-transform hover:scale-105 shrink-0">
              <div className="w-full h-full rounded-[24px] bg-white text-slate-950 flex items-center justify-center font-black text-2xl relative overflow-hidden shadow-inner">
                {(displayName || '').split(' ').map((w: string) => w ? w[0] : '').join('').toUpperCase().slice(0, 2) || 'U'}
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-xl font-bold tracking-tight leading-tight truncate">{displayName}</h2>
                {user.is_verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full shadow-sm">
                    <Shield className="w-3 h-3 text-blue-500 fill-blue-100" /> Верифицирован
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-white/80 bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg inline-block">
                {roleLabel}
              </p>
              <p className="text-xs text-white/70 font-medium truncate mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* High-Fidelity Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { 
              label: user.role === 'private' ? 'Мои заявки' : 'Вакансии', 
              value: myJobs.length, 
              icon: Briefcase, 
              href: user.role === 'private' ? '/my/short-work' : '/my/listings' 
            },
            { 
              label: 'Заполненность', 
              value: `${pct}%`, 
              icon: User, 
              href: '/my/edit-profile' 
            },
            { 
              label: 'Сохранённые', 
              value: '—', 
              icon: Star, 
              href: '/my/saved' 
            },
          ].map(({ label, value, icon: Icon, href }) => (
            <Link 
              key={label} 
              href={href} 
              className="card p-4 text-center hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-2.5 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                <Icon className={`w-4 h-4 ${statsColor}`} />
              </div>
              <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{label}</p>
            </Link>
          ))}
        </div>

        {/* Profile Checklist Box */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Заполненность профиля</h3>
              <p className="text-xs text-slate-400 font-semibold">Шаги к получению полной верификации на сайте</p>
            </div>
            <span className={`text-sm font-black ${statsColor}`}>{pct}%</span>
          </div>

          {/* Glowing animated bar */}
          <div className="relative">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${progressColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Checklist list */}
          <div className="space-y-3 pt-1">
            {completionItems.map(({ label, done }) => (
              <div key={label} className="flex items-center justify-between py-1 border-b border-slate-50/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    done ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-355" />
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${done ? 'text-slate-700' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {!done && (
                  <Link 
                    href="/my/edit-profile" 
                    className={`text-xs font-bold transition-all ${statsColor} hover:underline`}
                  >
                    Заполнить
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Details Box */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-50 uppercase tracking-wider">Личные данные аккаунта</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: User,  label: user.role === 'worker' ? 'ФИО Мастера' : 'Имя или Название', value: displayName },
              { icon: Mail,  label: 'Электронная почта', value: user.email },
              { icon: MapPin, label: 'Страна пребывания', value: 'Великобритания 🇬🇧' },
              { icon: Phone, label: 'Телефон в профиле', value: phone || 'Не указан' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-slate-55/40 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-slate-450" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">{label}</p>
                  <p className="text-xs sm:text-sm text-slate-800 font-bold truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactile Quick Actions Panel */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {user.role === 'worker' ? (
            <>
              <Link 
                href="/my/edit-profile" 
                className="card p-4 flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-sm shrink-0">
                  <Edit3 className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Редактировать CV</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Изменить анкету мастера</p>
                </div>
              </Link>

              <Link 
                href={workerProfile ? `/masters/${workerProfile.id}` : '/my/edit-profile'} 
                className="card p-4 flex items-center gap-4 hover:border-violet-200 hover:bg-violet-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition-colors shadow-sm shrink-0">
                  <User className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Посмотреть мое CV</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Как Вас видят работодатели</p>
                </div>
              </Link>
            </>
          ) : user.role === 'private' ? (
            <>
              <Link 
                href="/my/short-work/new" 
                className="card p-4 flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-sm shrink-0">
                  <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Опубликовать заявку</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Разовая задача для мастеров</p>
                </div>
              </Link>

              <Link 
                href="/my/short-work" 
                className="card p-4 flex items-center gap-4 hover:border-violet-200 hover:bg-violet-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition-colors shadow-sm shrink-0">
                  <Briefcase className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Мои заявки</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Управление разовыми задачами</p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/my/post-job" 
                className="card p-4 flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-sm shrink-0">
                  <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Создать вакансию</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Поиск рабочих на объекты</p>
                </div>
              </Link>

              <Link 
                href="/my/listings" 
                className="card p-4 flex items-center gap-4 hover:border-violet-200 hover:bg-violet-50/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition-colors shadow-sm shrink-0">
                  <Briefcase className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Мои вакансии</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Управление вакансиями</p>
                </div>
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
