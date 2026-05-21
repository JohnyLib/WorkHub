import Link from 'next/link'
import { HardHat, Home, Search, Users } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        {/* Illustration */}
        <div className="relative inline-flex mb-8">
          <div className="w-32 h-32 bg-blue-100 rounded-3xl flex items-center justify-center">
            <HardHat className="w-16 h-16 text-blue-400" />
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 font-black text-sm border-2 border-white">
            404
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Page Not Found</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Looks like this page has gone off-site. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all min-h-[48px] shadow-lg"
            style={{ boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/jobs"
            className="flex items-center justify-center gap-2 px-6 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 transition-all min-h-[48px]">
            <Search className="w-4 h-4" /> Browse Jobs
          </Link>
          <Link href="/masters"
            className="flex items-center justify-center gap-2 px-6 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 transition-all min-h-[48px]">
            <Users className="w-4 h-4" /> Find Workers
          </Link>
        </div>
      </div>
    </div>
  )
}
