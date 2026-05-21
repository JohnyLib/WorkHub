'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { PortfolioPhoto } from '@/types'

export function PhotoGallery({ photos }: { photos: PortfolioPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) return null

  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length))
  const next = () => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % photos.length))

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-square rounded-xl overflow-hidden group focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={photo.caption ?? `Photo ${i + 1}`}
          >
            <Image
              src={photo.storage_path}
              alt={photo.caption ?? `Portfolio photo ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 animate-fade-in">
          <button
            aria-label="Close lightbox"
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            aria-label="Previous photo"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-3xl w-full max-h-[80vh] aspect-video">
            <Image
              src={photos[lightboxIndex].storage_path}
              alt={photos[lightboxIndex].caption ?? 'Portfolio photo'}
              fill
              className="object-contain rounded-xl"
              sizes="100vw"
            />
          </div>

          <button
            aria-label="Next photo"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {photos[lightboxIndex].caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm px-4 py-2 bg-black/30 rounded-full">
              {photos[lightboxIndex].caption}
            </p>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === lightboxIndex ? 'bg-white w-3' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
