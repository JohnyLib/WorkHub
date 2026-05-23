'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/lib/supabase/actions'
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Heart,
  User,
  UserCircle,
  ShieldCheck,
  LogOut,
  Settings
} from 'lucide-react'

const EMPLOYER_LINKS = [
  { href: '/my/listings', label: 'Мои вакансии', icon: Briefcase },
  { href: '/my/post-job', label: 'Опубликовать вакансию', icon: PlusCircle },
]

const WORKER_LINKS = [
  { href: '/my/profile', label: 'Мой профиль / CV', icon: UserCircle },
  { href: '/my/saved', label: 'Сохранённые вакансии', icon: Heart },
]

const PRIVATE_LINKS = [
  { href: '/my/short-work', label: 'Мои заявки', icon: Briefcase },
  { href: '/my/short-work/new', label: 'Опубликовать заявку', icon: PlusCircle },
]

const ADMIN_LINKS = [
  { href: '/admin', label: 'Панель администратора', icon: ShieldCheck },
]

interface SidebarProps {
  role?: 'company' | 'agency' | 'worker' | 'private' | 'admin' | 'employer' | 'both'
  userName?: string
  userEmail?: string
}

export default function Sidebar({ role = 'worker', userName, userEmail }: SidebarProps) {
  const pathname = usePathname()

  let links: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = []

  if (role === 'company' || role === 'agency' || role === 'employer' || role === 'both') {
    links = EMPLOYER_LINKS
  } else if (role === 'worker') {
    links = WORKER_LINKS
  } else if (role === 'private') {
    links = PRIVATE_LINKS
  } else if (role === 'admin') {
    links = ADMIN_LINKS
  }

  const initials = userName
    ? userName.split(' ').map((w) => w ? w[0] : '').join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <div className="sticky top-20 card p-3 flex flex-col gap-1">
        {/* User info */}
        {(userName || userEmail) && (
          <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-slate-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              {userName && <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>}
              {userEmail && <p className="text-xs text-slate-400 truncate">{userEmail}</p>}
            </div>
          </div>
        )}

        {/* Section label */}
        <div className="px-3 py-1 mb-0.5">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Кабинет</span>
          </div>
        </div>

        {/* Nav links */}
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
              {label}
            </Link>
          )}
        )}

        {/* Settings link for everyone */}
        <Link
          href="/my/edit-profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            pathname === '/my/edit-profile'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${pathname === '/my/edit-profile' ? 'text-white' : 'text-slate-400'}`} />
          Настройки
        </Link>

        {/* Sign out */}
        <div className="mt-2 border-t border-slate-50 pt-2">
          <button
            onClick={async () => { await signOutAction(); window.location.href = '/' }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all w-full text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Выйти
          </button>
        </div>
      </div>
    </aside>
  )
}
