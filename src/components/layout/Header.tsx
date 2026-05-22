'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  Menu, X, HardHat, Bell, User, LogOut, Briefcase,
  ChevronDown, Settings, HelpCircle, Sparkles, ArrowRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { signOutAction } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/jobs',        label: 'Find Work',    emoji: '🔍' },
  { href: '/masters',     label: 'Find Workers', emoji: '👷' },
  { href: '/my/post-job', label: 'Post a Job',   emoji: '✚',  highlight: true },
]

export default function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [user, setUser]               = useState<SupabaseUser | null>(null)
  const [loading, setLoading]         = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname    = usePathname()
  const lastUserRef = useRef<SupabaseUser | null | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user); lastUserRef.current = user; setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser); setLoading(false)
      if (lastUserRef.current !== undefined) {
        if (event === 'SIGNED_IN' && currentUser) {
          const name = currentUser.user_metadata?.full_name || currentUser.email || 'User'
          toast.success(`Welcome back, ${name.split(' ')[0]}! 👋`)
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out successfully.')
        }
      }
      lastUserRef.current = currentUser
    })
    return () => { window.removeEventListener('scroll', onScroll); subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) { setPrevPathname(pathname); setMobileOpen(false) }

  const isLoggedIn = !!user
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'
  const displayName = user?.user_metadata?.full_name || user?.email || 'My Account'

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isSolid = scrolled || pathname !== '/'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isSolid
        ? 'bg-white shadow-md border-b border-slate-200/60'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="WorkBridge UK">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-200">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-heading font-bold text-[15px] tracking-tight transition-colors duration-200 ${
                isSolid ? 'text-slate-900' : 'text-white'
              }`}>
                Work<span className="text-blue-400">Bridge</span>
              </span>
              <span className={`text-[9px] font-semibold tracking-widest uppercase transition-colors duration-200 ${
                isSolid ? 'text-slate-400' : 'text-blue-200/60'
              }`}>United Kingdom</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              if (link.highlight) {
                return (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 ml-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                )
              }
              return (
                <Link key={link.href} href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 group/nav ${
                    active
                      ? isSolid ? 'text-blue-600 bg-blue-50' : 'text-white bg-white/15'
                      : isSolid ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                  {!active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-blue-400 group-hover/nav:w-4 transition-all duration-200" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── Desktop Right ── */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('start-onboarding-tour'))}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                isSolid ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Product tour"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {!loading && (
              isLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <button aria-label="Notifications"
                    className={`relative p-2 rounded-lg transition-all ${
                      isSolid ? 'text-slate-500 hover:bg-slate-100' : 'text-white/70 hover:bg-white/10'
                    }`}>
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-[1.5px] border-white" />
                  </button>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(o => !o)}
                      aria-label="User menu" aria-expanded={userMenuOpen}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-2xl transition-all ${
                        isSolid ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                      }`}>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                        {initials}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} ${isSolid ? 'text-slate-400' : 'text-white/50'}`} />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100/80 py-1.5 animate-fade-in-down overflow-hidden z-50">
                        {/* Top gradient accent */}
                        <div className="h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 mb-1.5" />
                        <div className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{displayName.split('@')[0]}</p>
                              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="h-px bg-slate-50 mx-3 my-1" />
                        {[
                          { href: '/my/profile',  icon: User,     label: 'My Profile' },
                          { href: '/my/listings', icon: Briefcase,label: 'My Listings' },
                          { href: '/my/post-job', icon: Settings,  label: 'Post a Job' },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link key={href} href={href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group/item"
                            onClick={() => setUserMenuOpen(false)}>
                            <span className="w-7 h-7 rounded-lg bg-slate-50 group-hover/item:bg-blue-100 flex items-center justify-center transition-colors">
                              <Icon className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-colors" />
                            </span>
                            {label}
                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                        <div className="h-px bg-slate-50 mx-3 my-1" />
                        <button
                          onClick={async () => { setUserMenuOpen(false); await signOutAction(); window.location.href = '/' }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left group/item">
                          <span className="w-7 h-7 rounded-lg bg-slate-50 group-hover/item:bg-red-100 flex items-center justify-center transition-colors">
                            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-red-500 transition-colors" />
                          </span>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login"
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                      isSolid ? 'text-slate-700 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'
                    }`}>
                    Sign In
                  </Link>
                  <Link href="/login?tab=register"
                    className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200">
                    Register Free
                  </Link>
                </div>
              )
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            id="mobile-menu-btn"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              mobileOpen
                ? 'bg-blue-50 text-blue-600'
                : isSolid ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-2xl border-t border-slate-100 shadow-2xl animate-fade-in-down">
          {/* Top gradient line */}
          <div className="h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500" />

          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href)
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all animate-fade-in-up ${
                    link.highlight
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25'
                      : active
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="text-base">{link.emoji}</span>
                  {link.label}
                </Link>
              )
            })}

            <div className="h-px bg-slate-100 my-3" />

            {isLoggedIn ? (
              <div className="space-y-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{displayName.split('@')[0]}</p>
                    <p className="text-xs text-slate-400">View dashboard</p>
                  </div>
                </div>
                <Link href="/my/listings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                  <Briefcase className="w-4 h-4 text-slate-400" /> My Dashboard
                </Link>
                <button
                  onClick={async () => { await signOutAction(); window.location.href = '/' }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all w-full text-left">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link href="/login?tab=register"
                  className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/25 min-h-[52px]">
                  <Sparkles className="w-4 h-4" /> Register Free — It&apos;s Quick
                </Link>
                <Link href="/login"
                  className="flex items-center justify-center px-4 py-3.5 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all min-h-[48px]">
                  Sign In to Your Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
