import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import Sidebar from '@/components/layout/Sidebar'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Heart } from 'lucide-react'
import { getCurrentUserAction, getSavedListingsAction } from '@/lib/supabase/actions'
import type { JobListing } from '@/types'

export const metadata: Metadata = { title: 'Saved Jobs' }

export default async function SavedPage() {
  const user = await getCurrentUserAction()
  const role = user?.role ?? 'both'
  const savedListings = await getSavedListingsAction()
  const savedJobs = savedListings.map((s) => s.listing).filter(Boolean) as JobListing[]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">
        <div className="flex gap-8 items-start">
          <Sidebar role={role} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 mb-6">Saved Jobs</h1>
            {savedJobs.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No saved jobs yet"
                description="Browse jobs and save the ones you like."
                ctaLabel="Browse Jobs"
                ctaHref="/jobs"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
                {savedJobs.map((job) => (
                  <JobCard key={job.id} job={job} saved />
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
