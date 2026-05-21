'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, HardHat, Globe, ChevronDown, Bell, User, LogOut, Briefcase, Settings, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { signOutAction } from '@/lib/supabase/actions'

const NAV_LINKS = [
  { href: '/jobs', label: 'Find Work' },
  { href: '/masters', label: 'Find Workers' },
  { href: '/my/post-job', label: 'Post a Job' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      subscription.unsubscribe()
    }
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isLoggedIn = !!user
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/92 backdrop-blur-xl shadow-sm border-b border-slate-100/80'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="WorkBridge UK home">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-200">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-bold text-[15px] tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                Work<span className="text-blue-400">Bridge</span>
              </span>
              <span className={`text-[10px] font-medium transition-colors ${scrolled ? 'text-slate-400' : 'text-blue-200/70'}`}>United Kingdom</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? scrolled
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-white bg-white/15'
                      : scrolled
                      ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              aria-label="Switch language"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                scrolled ? 'text-slate-500 hover:bg-slate-100' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              EN
              <ChevronDown className="w-3 h-3" />
            </button>

            {!loading && (
              isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {/* Notification bell */}
                  <button
                    aria-label="Notifications"
                    className={`relative p-2 rounded-lg transition-all ${scrolled ? 'text-slate-500 hover:bg-slate-100' : 'text-white/70 hover:bg-white/10'}`}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                  </button>

                  {/* User avatar dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen((o) => !o)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
                        scrolled ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                      }`}
                      aria-label="User menu"
                      aria-expanded={userMenuOpen}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {initials}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} ${scrolled ? 'text-slate-500' : 'text-white/70'}`} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in-down overflow-hidden z-50">
                        <div className="px-4 py-2.5 border-b border-slate-50">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {user?.user_metadata?.full_name || 'My Account'}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/my/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <User className="w-4 h-4 shrink-0" />
                            My Profile
                          </Link>
                          <Link href="/my/listings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Briefcase className="w-4 h-4 shrink-0" />
                            My Listings
                          </Link>
                          <Link href="/my/post-job" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Settings className="w-4 h-4 shrink-0" />
                            Post a Job
                          </Link>
                        </div>
                        <div className="border-t border-slate-50 py-1">
                          <button
                            onClick={async () => { setUserMenuOpen(false); await signOutAction(); window.location.href = '/' }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?tab=register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    Register Free
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className={`md:hidden p-2.5 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-100 shadow-2xl animate-fade-in-down">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
              )
            })}
            <div className="h-px bg-slate-100 my-2" />
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link href="/my/listings"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Dashboard
                </Link>
                <button
                  onClick={async () => { await signOutAction(); window.location.href = '/' }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login"
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-all min-h-[48px]">
                  Sign In
                </Link>
                <Link href="/login?tab=register"
                  className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all min-h-[48px] shadow-lg shadow-blue-600/20">
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
