import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { Scale, FileText, CheckCircle, AlertTriangle, HelpCircle, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Use — WorkBridge UK',
  description: 'Understand the terms and conditions for using WorkBridge UK to post construction jobs or search the worker directory.',
}

export default function TermsOfUsePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-3xl mb-4 text-blue-600">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">Terms of Use</h1>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4" /> Last Updated: May 21, 2026
            </p>
          </div>

          {/* Card Wrapper */}
          <div className="card p-6 sm:p-10 space-y-8 bg-white shadow-sm border border-slate-100 rounded-2xl animate-fade-in-up">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-5 h-5 text-blue-500" /> 1. Acceptance of Terms
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                By registering an account, posting construction job listings, or utilizing the worker directory on **WorkBridge UK** (the &quot;Platform&quot;), you agree to comply with and be bound by these Terms of Use and our Privacy Policy. If you do not agree, you must discontinue using our services immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckCircle className="w-5 h-5 text-blue-500" /> 2. Registration & Account Roles
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Users must provide complete and truthful profile information during registration. We offer roles tailored to the UK construction market:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>Workers:</strong> Agree to publish accurate trade qualifications, certifications (e.g. CSCS details), and work area locations.</li>
                <li><strong>Employers:</strong> Agree to represent genuine building projects, subcontracts, or agency staffing requirements.</li>
              </ul>
              <p className="text-sm text-slate-600 leading-relaxed">
                You are solely responsible for maintaining the confidentiality of your credentials and account access.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <AlertTriangle className="w-5 h-5 text-blue-500" /> 3. Prohibited Listing Content & Conduct
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                When posting jobs, employers must offer compliant compensation formats. All listings must conform to UK labor laws. We explicitly prohibit:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>Publishing listings offering below the legal UK National Minimum Wage (unless piecework is explicitly negotiated and approved).</li>
                <li>Spamming duplicate job offers across identical work areas.</li>
                <li>Misrepresenting trade requirements, safety conditions, or tools/PPE provision details.</li>
                <li>Posting discriminatory recruitment ads violating the **Equality Act 2010**.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Scale className="w-5 h-5 text-blue-500" /> 4. Disclaimer of Verification & Liability
              </h2>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-slate-700 leading-relaxed">
                <strong>Important Recruitment Notice:</strong> WorkBridge UK provides a directory mapping platform connecting workers directly with employers. We do **not** act as an employment agency, and we do not employ or supervise the tradespeople listed. 
                <br /><br />
                While we offer verified badges (e.g. **CSCS trust badges**), employers are solely responsible for executing comprehensive right-to-work checks, verification of physical CSCS cards, insurance, and professional references before hiring any worker.
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <HelpCircle className="w-5 h-5 text-blue-500" /> 5. Termination & Queries
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We reserve the right to suspend or terminate accounts that breach these Terms of Use or publish fraudulent job vacancies, without notice.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you have any questions regarding these Terms or want to report a violation, please contact us:
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">WorkBridge UK Support</p>
                  <p className="text-xs text-slate-500">London, United Kingdom</p>
                </div>
                <a href="mailto:support@workbridge.uk" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors min-h-[36px] flex items-center">
                  support@workbridge.uk
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
