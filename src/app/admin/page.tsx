import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import { MOCK_JOBS, MOCK_WORKER_PROFILES } from '@/lib/mock/data'
import { Users, Briefcase, Eye, TrendingUp, ShieldCheck, CheckCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default function AdminPage() {
  const stats = [
    { label: 'Total Jobs', value: MOCK_JOBS.length, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { label: 'Published', value: MOCK_JOBS.filter((j) => j.status === 'published').length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Worker Profiles', value: MOCK_WORKER_PROFILES.length, icon: Users, color: 'text-violet-600 bg-violet-50' },
    { label: 'Total Views', value: MOCK_JOBS.reduce((a, j) => a + j.views_count, 0), icon: Eye, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <div className="flex gap-8 items-start">
          <Sidebar role="admin" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent listings table */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Recent Listings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Profession</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_JOBS.map((job) => (
                      <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-800">{job.profession}</td>
                        <td className="px-5 py-3 text-slate-500">{job.location_area}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">{job.status}</span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{job.views_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
