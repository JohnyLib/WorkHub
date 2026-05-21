'use client'

import { Share2 } from 'lucide-react'

export function ShareButton({ title, location }: { title: string; location: string }) {
  return (
    <button
      onClick={async () => {
        if (typeof window === 'undefined') return
        const text = `${title} in ${location} — WorkBridge UK`
        if (navigator.share) {
          await navigator.share({ title: text, url: window.location.href })
        } else {
          await navigator.clipboard.writeText(window.location.href)
          const btn = document.activeElement as HTMLButtonElement
          if (btn) {
            const orig = btn.textContent
            btn.textContent = '✓ Link copied!'
            setTimeout(() => { if (btn) btn.textContent = orig }, 2000)
          }
        }
      }}
      aria-label="Share job"
      className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors min-h-[40px]"
    >
      <Share2 className="w-4 h-4" /> Share
    </button>
  )
}
