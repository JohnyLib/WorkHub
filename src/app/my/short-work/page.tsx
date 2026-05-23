import { getMyShortWorkListingsAction, getCurrentUserAction } from '@/lib/supabase/actions'
import MyShortWorkClient from './MyShortWorkClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { redirect } from 'next/navigation'

export const revalidate = 0 // Disable cache for user cabinets

export default async function MyShortWorkPage() {
  const user = await getCurrentUserAction()
  if (!user) {
    redirect('/login')
  }

  // Pre-fetch listings directly on the server
  const listings = await getMyShortWorkListingsAction()

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10 relative">
        {/* Dynamic background ambient glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <MyShortWorkClient user={user} listings={listings} />
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
