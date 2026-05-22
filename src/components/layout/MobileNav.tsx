'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Users, PlusCircle, User } from 'lucide-react'

const NAV = [
  { href: '/',           label: 'Home',    icon: Home },
  { href: '/jobs',       label: 'Jobs',    icon: Search },
  { href: '/my/post-job',label: 'Post',    icon: PlusCircle, primary: true },
  { href: '/masters',    label: 'Workers', icon: Users },
  { href: '/my/profile', label: 'Profile', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

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
        {NAV.map(({ href, label, icon: Icon, primary }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="relative flex flex-col items-center gap-1 -mt-6"
              >
                {/* Pulse ring */}
                <span
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'rgba(37,99,235,0.2)',
                    animation: 'pulse-ring 2.5s ease-out infinite',
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
              key={href}
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
