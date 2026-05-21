'use client'

import Link from 'next/link'
import { Phone, Mail, MessageCircle, Lock, Copy, Check } from 'lucide-react'
import { messengerLinks, MESSENGER_LABELS } from '@/lib/utils/messengers'
import type { MessengerType } from '@/types'
import { useState } from 'react'

interface ContactBlockProps {
  contactName: string
  contactPhone: string | null
  contactEmail: string | null
  messengers: MessengerType[]
  isLoggedIn?: boolean
  returnUrl?: string
}

const MESSENGER_STYLES: Record<MessengerType, { bg: string; icon: string }> = {
  whatsapp: { bg: 'bg-[#25D366] hover:bg-[#20ba58]', icon: '💬' },
  telegram: { bg: 'bg-[#0088CC] hover:bg-[#0077b5]', icon: '✈️' },
  viber:    { bg: 'bg-[#7360F2] hover:bg-[#6250e0]', icon: '📱' },
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export function ContactBlock({
  contactName,
  contactPhone,
  contactEmail,
  messengers,
  isLoggedIn = false,
  returnUrl = '/',
}: ContactBlockProps) {
  if (!isLoggedIn) {
    return (
      <div className="card p-6 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">Contact Details Hidden</h3>
        <p className="text-sm text-slate-500 mb-5">Sign in to see phone, email and messaging links</p>
        <Link
          href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors min-h-[48px] shadow-lg shadow-blue-600/25"
        >
          Sign In to Contact
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Contact Details</h3>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold border border-green-100">
          Verified
        </span>
      </div>

      <p className="font-semibold text-slate-800">{contactName}</p>

      {contactPhone && (
        <a
          href={`tel:${contactPhone}`}
          className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl text-sm font-medium text-slate-700 hover:text-blue-700 transition-all min-h-[48px] group border border-transparent hover:border-blue-100"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <span className="flex-1">{contactPhone}</span>
          <CopyButton value={contactPhone} label="phone" />
        </a>
      )}

      {contactEmail && (
        <a
          href={`mailto:${contactEmail}`}
          className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl text-sm font-medium text-slate-700 hover:text-blue-700 transition-all min-h-[48px] group border border-transparent hover:border-blue-100"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <span className="flex-1 truncate">{contactEmail}</span>
          <CopyButton value={contactEmail} label="email" />
        </a>
      )}

      {messengers.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Message via</p>
          <div className="flex gap-2 flex-wrap">
            {messengers.map((m) => {
              const style = MESSENGER_STYLES[m]
              return (
                <a
                  key={m}
                  href={contactPhone ? messengerLinks[m](contactPhone) : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all min-h-[44px] ${style.bg} shadow-sm hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {MESSENGER_LABELS[m]}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
