'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export function PhotoUpload() {
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: '2', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300&h=300' },
  ])

  const handleUpload = () => {
    toast.success('File upload window opened (mock)')
  }

  const handleRemove = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id))
    toast.info('Photo removed')
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div 
        onClick={handleUpload}
        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer"
      >
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Click to upload photos</p>
        <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-200">
              <img 
                src={photo.url} 
                alt="Portfolio upload" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                onClick={() => handleRemove(photo.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {/* Add more placeholder */}
          <button 
            onClick={handleUpload}
            className="aspect-square rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ImageIcon className="w-6 h-6 mb-2" />
            <span className="text-xs font-medium">Add more</span>
          </button>
        </div>
      )}
    </div>
  )
}
