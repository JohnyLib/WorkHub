'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Briefcase, Eye, MapPin, CheckCircle2, XCircle } from 'lucide-react'
import { updateShortWorkListingStatusAction } from '@/lib/supabase/actions'
import Sidebar from '@/components/layout/Sidebar'
import { WelcomeBanner } from '@/components/shared/WelcomeBanner'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface MyShortWorkClientProps {
  user: any
  listings: any[]
}

export default function MyShortWorkClient({ user, listings }: MyShortWorkClientProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const res = await updateShortWorkListingStatusAction(id, status)
      if (res.success) {
        toast.success('Статус заявки успешно изменен!')
        router.refresh()
      } else {
        toast.error('Не удалось обновить статус.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Произошла ошибка при обновлении статуса.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 text-xs font-bold bg-green-50 text-green-700 border border-green-200 rounded-full">Активна</span>
      case 'in_progress':
        return <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">В работе</span>
      case 'completed':
        return <span className="px-2 py-0.5 text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-full">Выполнена</span>
      case 'cancelled':
        return <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-red-700 border border-red-200 rounded-full">Отменена</span>
      default:
        return <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-500 rounded-full">{status}</span>
    }
  }

  return (
    <div className="flex gap-8 items-start">
      <Sidebar
        role="private"
        userName={user?.full_name || undefined}
        userEmail={user?.email}
      />
      <div className="flex-1 min-w-0 space-y-5">
        
        <WelcomeBanner role="private" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Мои заявки (Short Work)</h1>
            <p className="text-sm text-slate-500 mt-0.5">{listings.length} всего заявок</p>
          </div>
          <Link
            href="/my/short-work/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all min-h-[44px] shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Опубликовать заявку
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="card p-10 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-heading font-bold text-slate-800 text-lg">Нет заявок</h3>
            <p className="text-sm text-slate-400">Опубликуйте первую короткую заявку за 2 минуты, чтобы мастера нашли вас.</p>
            <Link href="/my/short-work/new" className="inline-flex items-center gap-2 btn-primary px-6 py-3 shadow-lg shadow-blue-600/20 cursor-pointer">
              Опубликовать первую <PlusCircle className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((job) => (
              <div key={job.id} className="card p-5 hover:border-blue-100 group transition-all">
                <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Service Emoji / Icon */}
                    <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {job.service_type === 'Сантехника' && '🚰'}
                      {job.service_type === 'Электрика' && '⚡'}
                      {job.service_type === 'Плитка' && '🧱'}
                      {job.service_type === 'Покраска' && '🎨'}
                      {job.service_type === 'Ремонт' && '🛠️'}
                      {job.service_type === 'Уборка' && '🧹'}
                      {!['Сантехника', 'Электрика', 'Плитка', 'Покраска', 'Ремонт', 'Уборка'].includes(job.service_type) && '🏠'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getStatusBadge(job.status)}
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{job.service_type}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base truncate">{job.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-relaxed">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mt-2 font-semibold">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.city}{job.postcode ? `, ${job.postcode}` : ''}
                        </span>
                        <span className="flex items-center gap-1 text-slate-700 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5">
                          💰 {job.budget_type === 'fixed' ? `£${job.budget_amount}` : 'Договорной'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {job.views_count || 0} просмотров
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-center sm:self-auto mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                    {job.status === 'published' && (
                      <>
                        <Link
                          href={`/my/short-work/${job.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all min-h-[38px] cursor-pointer"
                        >
                          Редактировать
                        </Link>
                        <button
                          type="button"
                          disabled={updatingId === job.id}
                          onClick={() => handleUpdateStatus(job.id, 'completed')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-600 hover:text-white rounded-xl transition-all min-h-[38px] disabled:opacity-50 cursor-pointer font-sans"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Закрыть
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === job.id}
                          onClick={() => handleUpdateStatus(job.id, 'cancelled')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all min-h-[38px] disabled:opacity-50 cursor-pointer font-sans"
                        >
                          <XCircle className="w-4 h-4" /> Отменить
                        </button>
                      </>
                    )}
                    <Link
                      href={`/hourly/${job.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all min-h-[38px]"
                    >
                      Просмотр
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
