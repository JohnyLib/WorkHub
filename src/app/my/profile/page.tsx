import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import Link from 'next/link'
import { MOCK_USER } from '@/lib/mock/data'
import { User, MapPin, Phone, Mail, Shield, Edit3, PlusCircle, Briefcase, Heart, CheckCircle2 } from 'lucide-react'
import { getCurrentUserAction, getWorkerProfileByUserIdAction, getMyJobsAction } from '@/lib/supabase/actions'

export const metadata: Metadata = { title: 'My Profile — WorkBridge UK' }

export default async function MyProfilePage() {
  const liveUser = await getCurrentUserAction()
  const user = liveUser || MOCK_USER
  const workerProfile = liveUser ? await getWorkerProfileByUserIdAction(liveUser.id) : null
  const myJobs = liveUser ? await getMyJobsAction() : []
  const phone = workerProfile?.contact_phone || null

  // Profile completion checklist
  const completionItems = [
    { label: 'Account created', done: true },
    { label: 'Full name set',   done: !!(user.full_name) },
    { label: 'Email verified',  done: !!(user.email) },
    { label: 'Worker profile',  done: !!workerProfile },
    { label: 'Phone number',    done: !!phone },
  ]
  const completedCount = completionItems.filter((i) => i.done).length
  const pct = Math.round((completedCount / completionItems.length) * 100)

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <div className="flex gap-8 items-start">
          <Sidebar
            role={user.role}
            userName={user.full_name || undefined}
            userEmail={user.email}
          />
          <div className="flex-1 min-w-0 max-w-2xl space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
              <Link href="/my/edit-profile" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[40px]">
                <Edit3 className="w-4 h-4" /> Edit
              </Link>
            </div>

            {/* Profile card */}
            <div className="card p-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                  {(user.full_name || '').split(' ').map((w) => w ? w[0] : '').join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900">{user.full_name || 'No Name'}</h2>
                    {user.is_verified && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 capitalize">
                    {user.role === 'both' ? 'Employer & Worker' : user.role}
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Listings', value: myJobs.length, icon: Briefcase, href: '/my/listings' },
                { label: 'Profile',  value: `${pct}%`,     icon: User,      href: '/my/edit-profile' },
                { label: 'Saved',    value: '—',            icon: Heart,     href: '/my/saved' },
              ].map(({ label, value, icon: Icon, href }) => (
                <Link key={label} href={href} className="card p-4 text-center hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <Icon className="w-5 h-5 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </Link>
              ))}
            </div>

            {/* Profile completion */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
                <span className="text-sm font-bold text-blue-600">{pct}%</span>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="space-y-2.5">
                {completionItems.map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-100' : 'bg-slate-100'}`}>
                      {done
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        : <div className="w-2 h-2 rounded-full bg-slate-300" />
                      }
                    </div>
                    <span className={`text-sm ${done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{label}</span>
                    {!done && (
                      <Link href="/my/edit-profile" className="ml-auto text-xs text-blue-600 hover:underline font-medium">
                        Complete
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Details */}
            <div className="card p-6 space-y-1">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Account Details</h3>
              {[
                { icon: User,  label: 'Full Name', value: user.full_name || '—' },
                { icon: Mail,  label: 'Email',     value: user.email },
                { icon: MapPin, label: 'Country',  value: 'United Kingdom 🇬🇧' },
                { icon: Phone, label: 'Phone',     value: phone || 'Not set' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="text-sm text-slate-800 font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/my/post-job" className="card p-4 flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Post a Job</p>
                  <p className="text-xs text-slate-500">Free listing</p>
                </div>
              </Link>
              <Link href="/my/create-profile" className="card p-4 flex items-center gap-3 hover:border-violet-200 hover:bg-violet-50/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                  <User className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Worker Profile</p>
                  <p className="text-xs text-slate-500">{workerProfile ? 'Update profile' : 'Create profile'}</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
