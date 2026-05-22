import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import Link from 'next/link'
import { JobStatusBadge } from '@/components/jobs/JobStatusBadge'
import { formatPayRate } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { EmptyState } from '@/components/shared/EmptyState'
import { Briefcase, PlusCircle, Eye, MapPin, TrendingUp, ArrowUpRight, Clock } from 'lucide-react'
import { getCurrentUserAction, getMyJobsAction } from '@/lib/supabase/actions'

export const metadata: Metadata = { title: 'My Listings — WorkBridge UK' }

export default async function MyListingsPage() {
  const user = await getCurrentUserAction()
  const role = user?.role ?? 'employer'
  const myJobs = await getMyJobsAction()

  const activeCount = myJobs.filter((j) => j.status === 'published').length
  const totalViews  = myJobs.reduce((acc, j) => acc + (j.views_count ?? 0), 0)

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <div className="flex gap-8 items-start">
          <Sidebar
            role={role}
            userName={user?.full_name || undefined}
            userEmail={user?.email}
          />
          <div className="flex-1 min-w-0 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Listings</h1>
                <p className="text-sm text-slate-500 mt-0.5">{myJobs.length} total listing{myJobs.length !== 1 ? 's' : ''}</p>
              </div>
              <Link
                href="/my/post-job"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all min-h-[44px] shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" /> Post Job
              </Link>
            </div>

            {/* Stats mini-dashboard */}
            {myJobs.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total',      value: myJobs.length,   icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Active',     value: activeCount,     icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                  { label: 'Total Views',value: totalViews,      icon: Eye,        color: 'text-violet-600 bg-violet-50' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card p-4 text-center">
                    <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Listings */}
            {myJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                illustration="jobs"
                title="No listings yet"
                description="Post your first job listing and start receiving applications from skilled tradespeople."
                ctaLabel="Post Your First Job"
                ctaHref="/my/post-job"
              />
            ) : (
              <div className="space-y-3 stagger">
                {myJobs.map((job) => (
                  <div key={job.id} className="card p-5 hover:border-blue-100 group">
                    <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">

                      {/* Profession icon */}
                      <div className="w-11 h-11 rounded-xl prof-default flex items-center justify-center font-bold text-base shrink-0">
                        {job.profession.charAt(0)}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <JobStatusBadge status={job.status} />
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" /> {formatDate(job.created_at)}
                          </span>
                        </div>
                        <h2 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.profession}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location_area}
                          </span>
                          <span className="font-semibold text-slate-700">{formatPayRate(job.pay_rate, job.pay_type)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> {job.views_count} views
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all min-h-[38px]"
                        >
                          View <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
