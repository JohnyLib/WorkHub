import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { ShieldCheck, Mail, FileText, Lock, Eye, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — WorkBridge UK',
  description: 'Learn how WorkBridge UK protects and processes your personal data under UK GDPR and the Data Protection Act 2018.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-3xl mb-4 text-blue-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">Privacy Policy</h1>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4" /> Last Updated: May 21, 2026
            </p>
          </div>

          {/* Card Wrapper */}
          <div className="card p-6 sm:p-10 space-y-8 bg-white shadow-sm border border-slate-100 rounded-2xl animate-fade-in-up">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-5 h-5 text-blue-500" /> 1. Introduction & Scope
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Welcome to <strong>WorkBridge UK Ltd</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are committed to protecting and respecting your privacy when you use our job platform, mobile tools, and directory services (collectively, the &quot;Platform&quot;). 
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This Privacy Policy explains how we collect, process, share, and protect your personal data in strict compliance with the **UK General Data Protection Regulation (UK GDPR)** and the **Data Protection Act 2018**.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Eye className="w-5 h-5 text-blue-500" /> 2. Personal Data We Collect
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To connect workers with employers effectively, we collect details that allow direct communication:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>Identity Data:</strong> Full name, profile photos, and role preference (employer, worker, or both).</li>
                <li><strong>Contact Data:</strong> Email address, mobile telephone number, and instant messenger usernames (e.g. WhatsApp, Telegram).</li>
                <li><strong>Professional Trade Data (Workers):</strong> Your trade specializations, work areas, team sizes, certifications (including **CSCS Card type** and number), and references.</li>
                <li><strong>Employer Data:</strong> Business name, website, and company type.</li>
                <li><strong>Usage & Technical Data:</strong> IP address, device specs, browser type, and cookies used to handle sessions.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Lock className="w-5 h-5 text-blue-500" /> 3. Legal Grounds for Processing
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Under UK GDPR, we process your information based on the following legal foundations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Contract Performance</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Necessary to set up your profiles, store job listings, and connect workers with recruiters.
                  </p>
                </div>
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Legitimate Interests</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Preventing platform abuse, verifying trade credentials (CSCS cards), and analyzing site usage to enhance UX.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" /> 4. Data Security & Storage
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                All personal credentials and contact profiles are stored securely in database clusters (using **Supabase PostgreSQL** architecture) equipped with Advanced Encryption Standards (AES-256) and strict Row Level Security (RLS) policies.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We store your data as long as your profile remains active. You can request complete, permanent erasure of your account and personal details at any time.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Mail className="w-5 h-5 text-blue-500" /> 5. Your Rights & Contacts
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                You have the right to request access to your personal data, seek rectification of errors, object to processing, or request complete account erasure.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                For any data queries, request forms, or to enforce your rights, contact our Data Protection Officer:
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">WorkBridge UK Ltd (DPO Team)</p>
                  <p className="text-xs text-slate-500">London, United Kingdom</p>
                </div>
                <a href="mailto:privacy@workbridge.uk" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors min-h-[36px] flex items-center">
                  privacy@workbridge.uk
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
