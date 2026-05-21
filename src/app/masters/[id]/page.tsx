import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { PhotoGallery } from '@/components/profiles/PhotoGallery'
import { ContactBlock } from '@/components/shared/ContactBlock'
import { MOCK_WORKER_PROFILES } from '@/lib/mock/data'
import { MapPin, Calendar, Users, Globe, CheckCircle, ChevronLeft } from 'lucide-react'
import type { MessengerType } from '@/types'

import { getWorkerByIdAction, getCurrentUserAction } from '@/lib/supabase/actions'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  let p = await getWorkerByIdAction(id)
  if (!p) {
    p = MOCK_WORKER_PROFILES.find((w) => w.id === id) || null
  }
  if (!p) return { title: 'Profile Not Found' }
  return {
    title: `${p.display_name} — ${p.type === 'master' ? 'Individual' : p.type === 'company' ? 'Company' : 'Agency'}`,
    description: p.bio?.slice(0, 160) ?? `${p.display_name} on WorkBridge UK`,
  }
}

export default async function MasterProfilePage({ params }: Props) {
  const { id } = await params
  let profile = await getWorkerByIdAction(id)
  if (!profile) {
    profile = MOCK_WORKER_PROFILES.find((w) => w.id === id) || null
  }
  if (!profile) notFound()

  const user = await getCurrentUserAction()
  const isLoggedIn = !!user
  const initials = profile.display_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const hasCscs = profile.certifications?.some((c) => c.toUpperCase().includes('CSCS'))

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <Link href="/masters" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Workers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <div className="card p-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900">{profile.display_name}</h1>
                    {profile.profile?.is_verified && (
                      <CheckCircle className="w-5 h-5 text-blue-500" aria-label="Verified" />
                    )}
                    {hasCscs && (
                      <span className="badge badge-cscs text-xs">
                        🛡️ CSCS Card Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm capitalize">
                    {profile.type === 'master' ? 'Individual Tradesperson' : profile.type === 'company' ? 'Company' : 'Agency'}
                  </p>
                  {profile.founded_year && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Est. {profile.founded_year}
                    </p>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-slate-600 leading-relaxed mt-5 border-t border-slate-100 pt-5">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {profile.specializations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.specializations.map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.work_areas.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Work Areas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.work_areas.map((a) => (
                      <span key={a} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.languages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.languages.map((l) => (
                      <span key={l} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.certifications.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.certifications.map((c) => (
                      <span key={c} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-100">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.team_size && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Team Size
                  </p>
                  <p className="text-sm font-medium text-slate-800">{profile.team_size}</p>
                </div>
              )}
              {profile.website && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </p>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Portfolio */}
            {profile.portfolio_photos && profile.portfolio_photos.length > 0 && (
              <div className="card p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">Portfolio</h2>
                <PhotoGallery photos={profile.portfolio_photos} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ContactBlock
              contactName={profile.display_name}
              contactPhone={profile.contact_phone}
              contactEmail={profile.contact_email}
              messengers={(profile.messengers as MessengerType[]) ?? []}
              isLoggedIn={isLoggedIn}
              returnUrl={`/masters/${profile.id}`}
            />
            <div className="card p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Piecework</span>
                <span className={`font-semibold ${profile.works_piecework ? 'text-green-600' : 'text-slate-400'}`}>
                  {profile.works_piecework ? '✓ Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
