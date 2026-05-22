import Link from 'next/link'
import { HardHat, Mail, Globe, ArrowUpRight, MapPin } from 'lucide-react'

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const FOOTER_LINKS = {
  'For Workers': [
    { label: 'Browse Jobs',      href: '/jobs' },
    { label: 'Find Workers',     href: '/masters' },
    { label: 'Create Profile',   href: '/my/create-profile' },
    { label: 'Register Free',    href: '/login?tab=register' },
  ],
  'For Employers': [
    { label: 'Post a Job',       href: '/my/post-job' },
    { label: 'Browse Workers',   href: '/masters' },
    { label: 'How It Works',     href: '/#how' },
    { label: 'Pricing',          href: '/pricing' },
  ],
  'Company': [
    { label: 'About Us',         href: '/about' },
    { label: 'Contact',          href: '/contact' },
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Use',     href: '/terms' },
  ],
}

const COUNTRIES = [
  { flag: '🇬🇧', label: 'UK', active: true },
  { flag: '🇮🇪', label: 'IE', soon: true },
  { flag: '🇩🇪', label: 'DE', soon: true },
]

const STATS = [
  { value: '2,400+', label: 'Active Jobs' },
  { value: '8,700+', label: 'Workers' },
  { value: '85',     label: 'Cities' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #060B18 0%, #0A1628 100%)' }}>
      {/* Mesh grid */}
      <div className="absolute inset-0 mesh-grid opacity-100 pointer-events-none" />
      {/* Top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Mini stats bar ── */}
        <div className="border-b border-white/5 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-[15px] leading-none">
                  Work<span className="text-blue-400">Bridge</span>
                </p>
                <p className="text-[9px] text-blue-300/50 font-semibold tracking-widest uppercase mt-0.5">United Kingdom</p>
              </div>
            </div>
            <div className="flex gap-8">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-heading font-black text-white text-lg leading-none">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <Link href="/my/post-job"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
              Post a Job Free
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Main footer grid ── */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              The UK&apos;s construction marketplace — connecting skilled tradespeople directly with employers. No fees, no middlemen, no BS.
            </p>

            {/* Countries */}
            <div className="flex flex-wrap gap-2 mb-6">
              {COUNTRIES.map(({ flag, label, active, soon }) => (
                <span key={label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    active ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' :
                    'border-white/5 text-slate-600 cursor-default'
                  }`}>
                  <span>{flag}</span> {label}
                  {soon && <span className="text-[9px] font-bold text-slate-600 bg-white/5 px-1 py-0.5 rounded">SOON</span>}
                </span>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Based in London, United Kingdom</span>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {[
                { href: 'mailto:hello@workbridge.uk', icon: Mail,         label: 'Email' },
                { href: 'https://x.com/workbridgeuk',icon: TwitterIcon,  label: 'Twitter' },
                { href: 'https://workbridge.uk',      icon: Globe,        label: 'Website' },
                { href: '#',                          icon: LinkedinIcon, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-9 h-9 rounded-xl border border-white/7 bg-white/3 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-5 font-heading">{group}</p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="group flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors duration-200">
                      <span className="w-0 group-hover:w-2.5 h-px bg-blue-400 transition-all duration-200 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} WorkBridge UK Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            {[
              { label: 'Privacy',  href: '/privacy' },
              { label: 'Terms',    href: '/terms' },
              { label: 'Cookies',  href: '/cookies' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="hover:text-slate-300 transition-colors">{label}</Link>
            ))}
            <span className="text-slate-700">Built with ❤️ in London</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
