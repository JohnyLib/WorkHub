import Link from 'next/link'
import { HardHat, ExternalLink, Mail, Globe, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = {
  'For Workers': [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Find Workers', href: '/masters' },
    { label: 'Create Profile', href: '/my/create-profile' },
    { label: 'Register Free', href: '/login?tab=register' },
  ],
  'For Employers': [
    { label: 'Post a Job', href: '/my/post-job' },
    { label: 'Browse Workers', href: '/masters' },
    { label: 'How It Works', href: '/#how' },
    { label: 'Pricing', href: '/pricing' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ],
}

const COUNTRIES = [
  { flag: '🇬🇧', label: 'United Kingdom', href: '#' },
  { flag: '🇮🇪', label: 'Ireland', href: '#', soon: true },
  { flag: '🇩🇪', label: 'Germany', href: '#', soon: true },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-[15px]">
                Work<span className="text-blue-400">Bridge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              The UK&apos;s construction job platform — connecting workers directly with employers. No fees, no middlemen.
            </p>

            {/* Countries */}
            <div className="flex flex-wrap gap-2 mb-5">
              {COUNTRIES.map(({ flag, label, href, soon }) => (
                <Link key={label} href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    soon
                      ? 'border-slate-700 text-slate-600 cursor-default'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}>
                  <span>{flag}</span>
                  {label}
                  {soon && <span className="text-[10px] font-bold text-slate-600 ml-0.5">Soon</span>}
                </Link>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2">
              <a href="mailto:hello@workbridge.uk" aria-label="Email"
                className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://x.com/workbridgeuk" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://workbridge.uk" target="_blank" rel="noopener noreferrer" aria-label="Website"
                className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-200 transition-colors group">
                      {label}
                      {href.startsWith('/my') && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} WorkBridge UK Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-slate-400 transition-colors">Cookies</Link>
            <span className="text-slate-700">Built with ❤️ in London</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
