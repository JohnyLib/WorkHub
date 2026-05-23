import { 
  getCurrentUserAction, 
  getWorkerProfileByUserIdAction, 
  getCompanyProfileByUserIdAction,
  getAgencyProfileByUserIdAction,
  getPrivateProfileByUserIdAction
} from '@/lib/supabase/actions'
import EditProfileClient from './EditProfileClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { redirect } from 'next/navigation'

export const revalidate = 0 // Disable cache for user cabinets

export default async function EditProfilePage() {
  const user = await getCurrentUserAction()
  if (!user) {
    redirect('/login')
  }

  // Load appropriate profile in parallel on the server
  let workerProfile = null
  let companyProfile = null
  let agencyProfile = null
  let privateProfile = null

  let profilePromise: Promise<any> = Promise.resolve(null)

  if (user.role === 'worker') {
    profilePromise = getWorkerProfileByUserIdAction(user.id)
  } else if (user.role === 'company') {
    profilePromise = getCompanyProfileByUserIdAction(user.id)
  } else if (user.role === 'agency') {
    profilePromise = getAgencyProfileByUserIdAction(user.id)
  } else if (user.role === 'private') {
    profilePromise = getPrivateProfileByUserIdAction(user.id)
  }

  const subProfile = await profilePromise

  if (user.role === 'worker') workerProfile = subProfile
  else if (user.role === 'company') companyProfile = subProfile
  else if (user.role === 'agency') agencyProfile = subProfile
  else if (user.role === 'private') privateProfile = subProfile

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10 relative">
        {/* Ambient background glows */}
        <div className="absolute top-40 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <EditProfileClient 
          user={user}
          workerProfile={workerProfile}
          companyProfile={companyProfile}
          agencyProfile={agencyProfile}
          privateProfile={privateProfile}
        />
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
