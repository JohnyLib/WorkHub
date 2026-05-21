'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import { UK_PROFESSIONS } from '@/lib/constants/professions'
import { toast } from 'sonner'
import { Briefcase, Building2, Users, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { upsertWorkerProfileAction } from '@/lib/supabase/actions'

type ProfileType = 'master' | 'company' | 'agency'

const TYPE_OPTIONS: { id: ProfileType; label: string; desc: string; icon: React.ComponentType<{className?: string}> }[] = [
  { id: 'master', label: 'Individual Master', desc: 'A skilled tradesperson looking for work', icon: Briefcase },
  { id: 'company', label: 'Company', desc: 'A construction company seeking projects', icon: Building2 },
  { id: 'agency', label: 'Agency', desc: 'A staffing agency supplying workers', icon: Users },
]

const inputCls = 'w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] bg-white'

export default function CreateProfilePage() {
  const router = useRouter()
  const [type, setType] = useState<ProfileType>('master')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [specializations, setSpecializations] = useState<string[]>([])
  const [workAreas, setWorkAreas] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const toggleSpec = (p: string) =>
    setSpecializations((prev) => prev.includes(p) ? prev.filter((s) => s !== p) : [...prev, p])

  const handleSubmit = async () => {
    if (!name) { toast.error('Display name is required'); return }
    setSubmitting(true)
    try {
      const res = await upsertWorkerProfileAction({
        type,
        display_name: name,
        bio,
        specializations,
        work_areas: workAreas.split(',').map((s) => s.trim()).filter(Boolean),
        contact_phone: phone,
      })
      if (res.success) {
        toast.success('Worker profile created successfully!')
        router.push('/my/profile')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to create worker profile.')
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred while creating profile.'
      toast.error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }



  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <div className="flex gap-8 items-start">
          <Sidebar role="worker" />
          <div className="flex-1 min-w-0 max-w-2xl">
            <h1 className="text-xl font-bold text-slate-900 mb-6">Create Worker Profile</h1>
            <div className="card p-6 sm:p-8 space-y-6">

              {/* Type selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Profile Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TYPE_OPTIONS.map(({ id, label, desc, icon: Icon }) => (
                    <button key={id} type="button" onClick={() => setType(id)}
                      className={`p-4 text-left border-2 rounded-2xl transition-all relative ${
                        type === id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}>
                      {type === id && (
                        <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-blue-600" />
                      )}
                      <Icon className={`w-5 h-5 mb-2 ${type === id ? 'text-blue-600' : 'text-slate-400'}`} />
                      <p className={`text-sm font-bold ${type === id ? 'text-blue-700' : 'text-slate-700'}`}>{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display name */}
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  {type === 'master' ? 'Your Name' : 'Company / Agency Name'} <span className="text-red-500">*</span>
                </label>
                <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={type === 'master' ? 'e.g. Viktor Petrov' : 'e.g. BuildRight Ltd'}
                  className={inputCls} />
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {UK_PROFESSIONS.slice(0, 14).map((p) => (
                    <button key={p} type="button" onClick={() => toggleSpec(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        specializations.includes(p)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work areas */}
              <div>
                <label htmlFor="work-areas" className="block text-sm font-medium text-slate-700 mb-1.5">Work Areas</label>
                <input id="work-areas" type="text" value={workAreas} onChange={(e) => setWorkAreas(e.target.value)}
                  placeholder="e.g. London, Essex, Kent" className={inputCls} />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="profile-bio" className="block text-sm font-medium text-slate-700 mb-1.5">About / Bio</label>
                <textarea id="profile-bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your experience, skills and what makes you stand out..."
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="profile-phone" className="block text-sm font-medium text-slate-700 mb-1.5">Contact Phone</label>
                <input id="profile-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7911 123456" className={inputCls} />
              </div>

              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 min-h-[50px] shadow-lg"
                style={{ boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
                {submitting ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
