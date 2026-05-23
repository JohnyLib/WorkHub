'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createShortWorkAction } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'

const SERVICES = [
  { id: 'Сантехника', label: 'Сантехника', emoji: '🚰', desc: 'Устранить течь, поменять кран' },
  { id: 'Электрика', label: 'Электрика', emoji: '⚡', desc: 'Розетки, выключатели, проводка' },
  { id: 'Плитка', label: 'Плитка', emoji: '🧱', desc: 'Плитка в ванную, фартук на кухне' },
  { id: 'Покраска', label: 'Покраска', emoji: '🎨', desc: 'Покрасить стены, обои, потолок' },
  { id: 'Ремонт', label: 'Ремонт', emoji: '🛠️', desc: 'Сборка мебели, мелкие работы' },
  { id: 'Уборка', label: 'Уборка', emoji: '🧹', desc: 'Клининг после ремонта, генеральная' },
]

interface NewShortWorkClientProps {
  user: any
  privateProfile: any
}

export default function NewShortWorkClient({ user, privateProfile }: NewShortWorkClientProps) {
  const router = useRouter()
  
  // Form State initialized instantly from server-fetched props
  const [serviceType, setServiceType] = useState('Сантехника')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  
  const [address, setAddress] = useState('')
  const [city, setCity] = useState(privateProfile?.city || '')
  const [postcode, setPostcode] = useState('')
  
  const [budgetType, setBudgetType] = useState('fixed')
  const [budgetAmount, setBudgetAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  
  const [urgency, setUrgency] = useState('ASAP')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('anytime')
  
  const [contactName, setContactName] = useState(privateProfile?.display_name || user?.full_name || '')
  const [contactPhone, setContactPhone] = useState(privateProfile?.phone || user?.phone || '')
  
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      toast.error('Введите заголовок заявки')
      return
    }
    if (!contactName || !contactPhone) {
      toast.error('Заполните контактное имя и телефон')
      return
    }

    setSubmitting(true)
    try {
      const res = await createShortWorkAction({
        service_type: serviceType,
        title,
        description,
        photos,
        address,
        city,
        postcode,
        budget_type: budgetType,
        budget_amount: budgetType === 'fixed' ? Number(budgetAmount) : undefined,
        payment_method: paymentMethod,
        urgency,
        preferred_date: preferredDate || undefined,
        preferred_time: preferredTime,
        contact_name: contactName,
        contact_phone: contactPhone,
      })

      if (res.success) {
        toast.success('Заявка успешно опубликована!')
        router.push('/my/short-work')
        router.refresh()
      } else {
        toast.error(res.error || 'Ошибка при создании заявки')
      }
    } catch (err) {
      console.error(err)
      toast.error('Произошла непредвиденная ошибка.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePhotoAdd = () => {
    if (photos.length >= 5) {
      toast.error('Максимально можно добавить 5 фотографий')
      return
    }
    const mockUrl = `https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=400`
    setPhotos([...photos, mockUrl])
    toast.success('Фотография успешно добавлена')
  }

  const handlePhotoRemove = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex gap-8 items-start">
      <Sidebar
        role="private"
        userName={user?.full_name || undefined}
        userEmail={user?.email}
      />
      <div className="flex-1 min-w-0 max-w-2xl">
        {/* Back link */}
        <Link href="/my/short-work" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider mb-5 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>

        <h1 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          Опубликовать разовую заявку
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SECTION 1: Что нужно сделать */}
          <div className="card p-6 space-y-4 bg-white border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">1</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Что нужно сделать</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Выберите тип услуги</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SERVICES.map((srv) => {
                  const isSelected = serviceType === srv.id
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setServiceType(srv.id)}
                      className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{srv.emoji}</span>
                      <span className="text-xs font-bold block">{srv.label}</span>
                      <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5 leading-tight">{srv.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label htmlFor="job-title" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Заголовок задачи *</label>
              <input
                id="job-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Починить капающий кран на кухне"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
              />
            </div>

            <div>
              <label htmlFor="job-desc" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Описание деталей</label>
              <textarea
                id="job-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите подробно, что нужно сделать. Это поможет мастерам точнее оценить стоимость работ."
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white resize-none shadow-sm hover:border-slate-300 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Фотографии (до 5 штук)</label>
                <span className="text-xs text-slate-400 font-medium">{photos.length} / 5</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Загруженное фото" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handlePhotoRemove(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={handlePhotoAdd}
                    className="w-16 h-16 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold cursor-pointer"
                  >
                    <span>+ Добавить</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Где */}
          <div className="card p-6 space-y-4 bg-white border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">2</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Где</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label htmlFor="job-city" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Город</label>
                <input
                  id="job-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Например: Лондон"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="job-postcode" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Почтовый индекс (Postcode)</label>
                <input
                  id="job-postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Например: EC1A 1BB"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="job-addr" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Адрес / Район</label>
                <input
                  id="job-addr"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Например: Брик Лейн"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Бюджет */}
          <div className="card p-6 space-y-4 bg-white border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">3</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Бюджет</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Тип бюджета</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBudgetType('fixed')}
                    className={`py-2.5 text-xs font-bold border rounded-lg transition-all cursor-pointer ${
                      budgetType === 'fixed'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-sm'
                        : 'border-slate-200 text-slate-500 bg-white hover:border-slate-350'
                    }`}
                  >
                    Фиксированная сумма
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetType('negotiable')}
                    className={`py-2.5 text-xs font-bold border rounded-lg transition-all cursor-pointer ${
                      budgetType === 'negotiable'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-sm'
                        : 'border-slate-200 text-slate-500 bg-white hover:border-slate-350'
                    }`}
                  >
                    Договорной
                  </button>
                </div>
              </div>

              {budgetType === 'fixed' && (
                <div>
                  <label htmlFor="budget-amt" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Сумма (£ GBP)</label>
                  <input
                    id="budget-amt"
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="Например: 150"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Способ оплаты</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="w-4 h-4 text-blue-600"
                  />
                  Наличные
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="w-4 h-4 text-blue-600"
                  />
                  Банковский перевод
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: Когда */}
          <div className="card p-6 space-y-4 bg-white border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">4</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Когда</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Срочность</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-350 transition-all"
                >
                  <option value="ASAP">Срочно (ASAP)</option>
                  <option value="this_week">На этой неделе</option>
                  <option value="not_urgent">Не срочно</option>
                </select>
              </div>

              <div>
                <label htmlFor="pref-date" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Желаемая дата</label>
                <input
                  id="pref-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Время суток</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-350 transition-all"
                >
                  <option value="anytime">В любое время</option>
                  <option value="morning">Утро (08:00 - 12:00)</option>
                  <option value="afternoon">День (12:00 - 17:00)</option>
                  <option value="evening">Вечер (17:00 - 21:00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 5: Контакт */}
          <div className="card p-6 space-y-4 bg-white border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">5</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Контактные данные</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ct-name" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Имя контакта *</label>
                <input
                  id="ct-name"
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Имя"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                />
              </div>

              <div>
                <label htmlFor="ct-phone" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Телефон контакта *</label>
                <input
                  id="ct-phone"
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Номер телефона"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white min-h-[48px] shadow-sm hover:border-slate-300 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer text-base font-sans"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            {submitting ? 'Публикация...' : 'Опубликовать заявку'}
          </button>

        </form>
      </div>
    </div>
  )
}
