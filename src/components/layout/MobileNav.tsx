'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Users, PlusCircle, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Search },
  { href: '/my/post-job', label: 'Post', icon: PlusCircle, primary: true },
  { href: '/masters', label: 'Workers', icon: Users },
  { href: '/my/profile', label: 'Profile', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80"
      role="navigation"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 pt-1 pb-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, primary }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px] transition-all ${
                primary ? 'relative -top-4' : ''
              }`}
            >
              {primary ? (
                <div
                  className="w-13 h-13 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    width: 52,
                    height: 52,
                    boxShadow: '0 8px 24px rgba(37,99,235,0.45)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isActive ? 'bg-blue-50 scale-110' : 'scale-100'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                </div>
              )}
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  primary
                    ? 'text-blue-600 mt-1'
                    : isActive
                    ? 'text-blue-600'
                    : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
