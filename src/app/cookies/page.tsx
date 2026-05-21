import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { Eye, Info, Check, Cookie, Shield, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy — WorkBridge UK',
  description: 'Understand how WorkBridge UK uses cookies and tracking technologies to optimize your search and onboarding experience.',
}

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-3xl mb-4 text-blue-600">
              <Cookie className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">Cookie Policy</h1>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4" /> Last Updated: May 21, 2026
            </p>
          </div>

          {/* Card Wrapper */}
          <div className="card p-6 sm:p-10 space-y-8 bg-white shadow-sm border border-slate-100 rounded-2xl animate-fade-in-up">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Info className="w-5 h-5 text-blue-500" /> 1. What Are Cookies?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cookies are small text files stored on your computer or mobile device when you visit websites. They help the platform function efficiently, remember preferences, and provide analytical data to site administrators.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Shield className="w-5 h-5 text-blue-500" /> 2. Types of Cookies We Use
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                WorkBridge UK uses the following cookie categories to deliver trade listings:
              </p>
              
              <div className="space-y-4 pt-2">
                {/* Cookie Item 1 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Essential / Functional Cookies (Always Active)</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Required for basic platform operations, including auth token sessions (Supabase), secure profile updates, and temporary draft storage during job posts.
                    </p>
                  </div>
                </div>

                {/* Cookie Item 2 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Analytical & Performance Cookies (Optional)</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      We use Google Analytics (GA4) to collect anonymous tracking statistics on traffic channels, page engagement, and conversion performance to optimize job directory search speeds.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Cookie className="w-5 h-5 text-blue-500" /> 3. Managing Cookie Preferences
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                You can configure or block cookies at any time via your internet browser settings (e.g. Chrome, Safari, Edge, Firefox). Please note that disabling essential cookies may impact your ability to remain logged in or submit new job advertisements.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Shield className="w-5 h-5 text-blue-500" /> 4. Updates & Contacts
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We may periodically update this Cookie Policy. If you have any questions regarding cookie usage, please contact us at:
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">WorkBridge UK Support Team</p>
                  <p className="text-xs text-slate-500">London, United Kingdom</p>
                </div>
                <a href="mailto:hello@workbridge.uk" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors min-h-[36px] flex items-center">
                  hello@workbridge.uk
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
