import { getCurrentUserAction, getShortWorkListingByIdAction } from '@/lib/supabase/actions'
import EditShortWorkClient from './EditShortWorkClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { redirect } from 'next/navigation'

export const revalidate = 0 // Disable cache for user cabinets

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditShortWorkPage({ params }: EditPageProps) {
  const { id } = await params

  // 1. Fetch user session on the server
  const user = await getCurrentUserAction()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch the listing by ID
  const listing = await getShortWorkListingByIdAction(id)
  if (!listing) {
    redirect('/my/short-work')
  }

  // 3. Security check: make sure this user is the listing owner
  if (listing.profile_id !== user.id) {
    redirect('/my/short-work')
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10 relative">
        {/* Dynamic background ambient glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <EditShortWorkClient id={id} user={user} listing={listing} />
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
