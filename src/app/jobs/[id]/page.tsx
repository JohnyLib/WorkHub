import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { ContactBlock } from '@/components/shared/ContactBlock'
import { JobStatusBadge } from '@/components/jobs/JobStatusBadge'
import { JobCard } from '@/components/jobs/JobCard'
import { MOCK_JOBS } from '@/lib/mock/data'
import { formatPayRate } from '@/lib/utils/formatCurrency'
import { formatDate, formatShortDate } from '@/lib/utils/formatDate'
import {
  MapPin, Users, Clock, Calendar, Wrench, FileText,
  HardHat, ChevronLeft, Eye, Banknote, Check, Flag,
} from 'lucide-react'
import { getJobByIdAction, getCurrentUserAction, getJobListingsAction } from '@/lib/supabase/actions'
import { ShareButton } from '@/components/jobs/ShareButton'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  let job = await getJobByIdAction(id)
  if (!job) job = MOCK_JOBS.find((j) => j.id === id) || null
  if (!job) return { title: 'Job Not Found' }
  return {
    title: `${job.profession} in ${job.location_area} — WorkBridge UK`,
    description: `${job.profession} job in ${job.location_area}. Pay: ${formatPayRate(job.pay_rate, job.pay_type)}. ${job.extra_notes ?? ''}`.slice(0, 160),
    openGraph: {
      title: `${job.profession} — ${job.location_area}`,
      description: `Pay: ${formatPayRate(job.pay_rate, job.pay_type)}. ${job.workers_count} worker(s) needed.`,
    },
  }
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-800 font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params
  let job = await getJobByIdAction(id)
  if (!job) job = MOCK_JOBS.find((j) => j.id === id) || null
  if (!job) notFound()

  const [user, allJobs] = await Promise.all([
    getCurrentUserAction(),
    getJobListingsAction(),
  ])

  const isLoggedIn = !!user
  const similarJobs = allJobs
    .filter((j) => j.id !== job!.id && j.profession.toLowerCase() === job!.profession.toLowerCase())
    .slice(0, 3)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.profession,
    description: job.extra_notes || `${job.profession} job in ${job.location_area}`,
    datePosted: job.created_at,
    validThrough: job.expires_at,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location_area,
        addressCountry: 'GB',
        postalCode: job.location_postcode || undefined,
      },
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: job.employer_name || job.contact_name,
    },
    ...(job.pay_rate && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'GBP',
        value: {
          '@type': 'QuantitativeValue',
          value: job.pay_rate,
          unitText: job.pay_type === 'hour' ? 'HOUR' : 'DAY',
        },
      },
    }),
  }

  return (
    <>
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-[200px]">{job.profession}</span>
        </nav>

        {/* Back link */}
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="card p-6 animate-fade-in-up">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <JobStatusBadge status={job.status} />
                    {job.employer_type && (
                      <span className="text-xs text-slate-500 capitalize px-2 py-0.5 bg-slate-100 rounded-full">
                        {job.employer_type}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">{job.profession}</h1>
                  {job.employer_name && (
                    <p className="text-slate-500 mt-1">{job.employer_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">
                    {formatPayRate(job.pay_rate, job.pay_type)}
                  </p>
                  {job.pay_period && (
                    <p className="text-xs text-slate-400 mt-0.5">Paid {job.pay_period}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  {job.location_area}{job.location_postcode ? `, ${job.location_postcode}` : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> {job.views_count} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {formatDate(job.created_at)}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <ShareButton title={job.profession} location={job.location_area} />
                <a
                  href={`mailto:report@workbridge.uk?subject=Report: ${job.id}`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors min-h-[40px]"
                >
                  <Flag className="w-4 h-4" /> Report
                </a>
              </div>
            </div>

            {/* Job Details */}
            <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                  <Wrench className="w-3.5 h-3.5 text-blue-500" />
                </div>
                Job Details
              </h2>
              <InfoRow icon={Users} label="Workers Needed" value={`${job.workers_count} worker(s)`} />
              {job.days_per_week && <InfoRow icon={Calendar} label="Days per Week" value={`${job.days_per_week} days`} />}
              {job.hours_paid && <InfoRow icon={Clock} label="Paid Hours / Day" value={`${job.hours_paid} hrs`} />}
              {job.hours_onsite && <InfoRow icon={Clock} label="On-site Hours / Day" value={`${job.hours_onsite} hrs`} />}
              {job.start_date && <InfoRow icon={Calendar} label="Start Date" value={formatShortDate(job.start_date)} />}
              {job.project_duration && <InfoRow icon={Calendar} label="Project Duration" value={job.project_duration} />}
              {job.payment_method && <InfoRow icon={Banknote} label="Payment Method" value={job.payment_method.charAt(0).toUpperCase() + job.payment_method.slice(1)} />}
              <InfoRow icon={Wrench} label="Tools Provided" value={job.tools_provided ? '✓ Yes, tools provided' : '✗ No — bring your own'} />
            </div>

            {/* Requirements */}
            {(job.required_docs.length > 0 || job.ppe_provided.length > 0) && (
              <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  Requirements & PPE
                </h2>
                {job.required_docs.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-slate-700">Required Documents</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.required_docs.map((doc) => (
                        <span key={doc} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-100">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.ppe_provided.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HardHat className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-slate-700">PPE Provided</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.ppe_provided.map((item) => (
                        <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100">
                          <Check className="w-3 h-3" /> {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {job.extra_notes && (
              <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <h2 className="text-base font-bold text-slate-900 mb-3">Additional Notes</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.extra_notes}</p>
              </div>
            )}

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Similar Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
                  {similarJobs.map((j) => (
                    <JobCard key={j.id} job={j} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ContactBlock
              contactName={job.contact_name}
              contactPhone={job.contact_phone}
              contactEmail={job.contact_email}
              messengers={job.messengers}
              isLoggedIn={isLoggedIn}
              returnUrl={`/jobs/${job.id}`}
            />

            {/* Expiry */}
            <div className="card p-4 text-sm text-slate-500">
              <p className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Expires: <span className="font-semibold text-slate-700">{formatShortDate(job.expires_at)}</span>
              </p>
            </div>

            {/* Quick facts */}
            <div className="card p-4 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Quick Facts</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Workers needed</span>
                <span className="font-semibold text-slate-900">{job.workers_count}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Pay type</span>
                <span className="font-semibold text-slate-900 capitalize">{job.pay_type}</span>
              </div>
              {job.start_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Start date</span>
                  <span className="font-semibold text-slate-900">{formatShortDate(job.start_date)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tools provided</span>
                <span className={`font-semibold ${job.tools_provided ? 'text-green-600' : 'text-slate-900'}`}>
                  {job.tools_provided ? 'Yes' : 'No'}
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


