import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { ContactBlock } from '@/components/shared/ContactBlock'
import { getShortWorkListingByIdAction, getCurrentUserAction } from '@/lib/supabase/actions'
import { MapPin, Calendar, Clock, ChevronLeft, Eye, Award, Hammer, Banknote, Shield } from 'lucide-react'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const job = await getShortWorkListingByIdAction(id)
  if (!job) return { title: 'Заявка не найдена' }
  return {
    title: `${job.title} в ${job.city} — WorkBridge UK`,
    description: `${job.service_type} задача в ${job.city}. Бюджет: ${job.budget_type === 'fixed' ? `£${job.budget_amount}` : 'Договорной'}. ${job.description ?? ''}`.slice(0, 160),
  }
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-orange-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-sm text-slate-800 font-bold mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default async function ShortWorkDetailPage({ params }: Props) {
  const { id } = await params
  const job = await getShortWorkListingByIdAction(id)
  if (!job) notFound()

  const user = await getCurrentUserAction()
  const isLoggedIn = !!user

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/hourly" className="hover:text-blue-600 transition-colors">Hourly Listings</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-[200px]">{job.title}</span>
        </nav>

        {/* Back link */}
        <Link href="/hourly" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Назад к ленте разовых задач
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="card p-6 animate-fade-in-up">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-wide">
                      {job.service_type}
                    </span>
                    <span className="text-xs text-slate-500 capitalize px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200 font-semibold">
                      Short Work 🏠
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight mt-1">{job.title}</h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-orange-600">
                    {job.budget_type === 'fixed' ? `£${job.budget_amount}` : 'Договорной'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Бюджет задачи</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-5 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {job.city}{job.postcode ? `, ${job.postcode}` : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-400" /> {job.views_count || 0} просмотров
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> {new Date(job.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Photos if any */}
            {job.photos && job.photos.length > 0 && (
              <div className="card p-6 space-y-3">
                <h3 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider">Прикрепленные фото</h3>
                <div className="flex flex-wrap gap-3">
                  {job.photos.map((url: string, idx: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={idx}
                      src={url}
                      alt={`Фото объекта ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200 hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                  <Hammer className="w-3.5 h-3.5 text-orange-500" />
                </div>
                Детали заявки
              </h2>
              <InfoRow icon={Award} label="Тип услуги" value={job.service_type} />
              <InfoRow icon={MapPin} label="Адрес / Район" value={job.address || 'Точный адрес скрыт владельцем'} />
              <InfoRow icon={Banknote} label="Способ оплаты" value={job.payment_method === 'cash' ? 'Наличные' : 'Банковский перевод'} />
              <InfoRow icon={Clock} label="Срочность задачи" value={job.urgency === 'ASAP' ? 'Срочно (ASAP)' : job.urgency === 'this_week' ? 'На этой неделе' : 'Не срочно'} />
              {job.preferred_date && <InfoRow icon={Calendar} label="Желаемая дата" value={job.preferred_date} />}
              <InfoRow icon={Clock} label="Удобное время суток" value={job.preferred_time === 'morning' ? 'Утро (08:00 - 12:00)' : job.preferred_time === 'afternoon' ? 'День (12:00 - 17:00)' : job.preferred_time === 'evening' ? 'Вечер (17:00 - 21:00)' : 'В любое время'} />
            </div>

            {/* Description */}
            {job.description && (
              <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-base font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">Описание задачи</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ContactBlock
              contactName={job.contact_name || ''}
              contactPhone={job.contact_phone || ''}
              contactEmail={null}
              messengers={[]}
              isLoggedIn={isLoggedIn}
              returnUrl={`/hourly/${job.id}`}
            />

            {/* Safety Tips */}
            <div className="card p-5 space-y-3 bg-slate-50 border border-slate-100">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-orange-500" />
                Безопасность Trades
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
                <li>• Обсудите точный объем работ и цену до начала выполнения.</li>
                <li>• Убедитесь, что у вас есть все необходимые инструменты с собой.</li>
                <li>• Получайте оплату сразу по завершении работы на объекте.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
