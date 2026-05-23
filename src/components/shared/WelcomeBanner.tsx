'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Sparkles, PlusCircle, ArrowRight, UserCheck } from 'lucide-react'
import Link from 'next/link'

interface WelcomeBannerProps {
  role: 'company' | 'agency' | 'worker' | 'private'
}

export function WelcomeBanner({ role }: WelcomeBannerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show banner only if ?welcome=1 is present in the URL
    if (searchParams?.get('welcome') === '1') {
      setShow(true)

      // Auto-dismiss after 12 seconds
      const timer = setTimeout(() => {
        handleDismiss()
      }, 12000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleDismiss = () => {
    setShow(false)
    // Clean up the URL query parameter ?welcome=1 without reloading
    const params = new URLSearchParams(window.location.search)
    params.delete('welcome')
    const newSearch = params.toString()
    const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '')
    router.replace(newPath)
  }

  if (!show) return null

  // Define role specific contents
  let title = ''
  let buttonText = ''
  let buttonLink = ''
  let colorCls = ''
  let icon = <Sparkles className="w-5 h-5" />

  if (role === 'company' || role === 'agency') {
    title = 'Аккаунт создан! Опубликуй первую вакансию'
    buttonText = 'Опубликовать'
    buttonLink = '/my/post-job'
    colorCls = 'from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
    icon = <PlusCircle className="w-5 h-5" />
  } else if (role === 'worker') {
    title = 'Добро пожаловать! Заполни свой профиль — работодатели увидят тебя в поиске'
    buttonText = 'Заполнить профиль'
    buttonLink = '/my/edit-profile'
    colorCls = 'from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
    icon = <UserCheck className="w-5 h-5" />
  } else if (role === 'private') {
    title = 'Готово! Нужен мастер? Опубликуй заявку за 2 минуты'
    buttonText = 'Опубликовать заявку'
    buttonLink = '/my/short-work/new'
    colorCls = 'from-orange-500 to-amber-600 text-white shadow-orange-500/20'
    icon = <PlusCircle className="w-5 h-5" />
  }

  return (
    <div className="w-full mb-6 relative animate-fade-in-up">
      <div className={`p-5 sm:p-6 rounded-[24px] bg-gradient-to-r ${colorCls} shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 z-10`}>
        {/* Glow Effects */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex-1 space-y-3 relative z-10 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <h3 className="font-heading font-bold text-[15px] sm:text-base leading-snug tracking-tight">
              {title}
            </h3>
          </div>

          {/* Progress bar only for Worker starting at ~30% */}
          {role === 'worker' && (
            <div className="w-full max-w-md pt-1">
              <div className="flex justify-between text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-1">
                <span>Заполненность CV</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-emerald-500/50" 
                  style={{ width: '30%' }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10 w-full md:w-auto justify-end">
          <Link
            href={buttonLink}
            onClick={handleDismiss}
            className="flex items-center justify-center gap-1.5 px-5 py-3 bg-white text-slate-900 font-bold rounded-xl text-sm hover:bg-slate-50 active:scale-95 transition-all w-full md:w-auto shadow-md"
          >
            {buttonText} <ArrowRight className="w-4 h-4 text-slate-800" />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Закрыть приветствие"
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
