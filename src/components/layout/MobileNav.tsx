'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Users, PlusCircle, User, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MobileNav() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true)
        supabase.from('profiles').select('role').eq('id', user.id).single().then(({ data }) => {
          if (data) setRole(data.role)
        })
      } else {
        setIsLoggedIn(false)
        setRole(null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user
      if (u) {
        setIsLoggedIn(true)
        supabase.from('profiles').select('role').eq('id', u.id).single().then(({ data }) => {
          if (data) setRole(data.role)
        })
      } else {
        setIsLoggedIn(false)
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Dynamic bottom menu configuration based on role
  let navItems = [
    { href: '/',           label: 'Главная',    icon: Home },
    { href: '/jobs',       label: 'Вакансии',    icon: Search },
    { href: '/masters',    label: 'Мастера',    icon: Users },
    { href: '/login',      label: 'Войти',      icon: PlusCircle, primary: true },
    { href: '/login',      label: 'Кабинет',    icon: User },
  ]

  if (isLoggedIn) {
    if (role === 'company' || role === 'agency') {
      navItems = [
        { href: '/',           label: 'Главная',    icon: Home },
        { href: '/jobs',       label: 'Вакансии',    icon: Search },
        { href: '/masters',    label: 'Мастера',    icon: Users },
        { href: '/my/post-job',label: 'Опубликовать',icon: PlusCircle, primary: true },
        { href: '/my/listings',label: 'Кабинет',    icon: User },
      ]
    } else if (role === 'worker') {
      navItems = [
        { href: '/',           label: 'Главная',    icon: Home },
        { href: '/jobs',       label: 'Вакансии',    icon: Search },
        { href: '/masters',    label: 'Мастера',    icon: Users },
        { href: '/my/saved',   label: 'Сохранённые', icon: Star, primary: true },
        { href: '/my/profile', label: 'Кабинет',    icon: User },
      ]
    } else if (role === 'private') {
      navItems = [
        { href: '/',           label: 'Главная',    icon: Home },
        { href: '/jobs',       label: 'Вакансии',    icon: Search },
        { href: '/masters',    label: 'Мастера',    icon: Users },
        { href: '/my/short-work/new', label: 'Новая заявка', icon: PlusCircle, primary: true },
        { href: '/my/short-work',     label: 'Кабинет',      icon: User },
      ]
    }
  }

  return (
    <nav
      className="md:hidden fixed bottom-4 left-4 right-4 z-40"
      role="navigation"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="flex items-center justify-around px-2 py-2 rounded-[28px] bg-white/95 backdrop-blur-2xl border border-slate-200/70"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)' }}
      >
        {navItems.map(({ href, label, icon: Icon, primary }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (primary) {
            return (
              <Link
                key={`${href}-${label}`}
                href={href}
                aria-label={label}
                className="relative flex flex-col items-center gap-1 -mt-6"
              >
                {/* Pulse ring */}
                <span
                  className="absolute inset-0 rounded-2xl animate-pulse"
                  style={{
                    background: 'rgba(37,99,235,0.2)',
                    borderRadius: '18px',
                  }}
                />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform active:scale-90"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.5), 0 2px 8px rgba(37,99,235,0.3)',
                  }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-bold text-blue-600 tracking-wide uppercase">{label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              aria-label={label}
              className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px] group"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 scale-110'
                  : 'group-active:scale-90'
              }`}>
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-semibold transition-colors duration-200 leading-none ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
