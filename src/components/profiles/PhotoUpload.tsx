'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { PortfolioPhoto } from '@/types'
import Image from 'next/image'

interface PhotoUploadProps {
  workerProfileId: string | null
  userId: string
}

export function PhotoUpload({ workerProfileId, userId }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [prevProfileId, setPrevProfileId] = useState<string | null>(null)
  if (workerProfileId !== prevProfileId) {
    setPrevProfileId(workerProfileId)
    setPhotos([])
  }

  useEffect(() => {
    if (!workerProfileId) return
    const currentProfileId = workerProfileId

    async function loadPhotos() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('portfolio_photos')
          .select('*')
          .eq('worker_profile_id', currentProfileId)
          .order('uploaded_at', { ascending: true })

        if (error) throw error
        if (data) {
          const mappedPhotos: PortfolioPhoto[] = data.map((photo) => ({
            id: photo.id,
            worker_profile_id: photo.worker_profile_id || '',
            storage_path: photo.storage_path,
            caption: photo.caption,
            uploaded_at: photo.uploaded_at || new Date().toISOString(),
          }))
          setPhotos(mappedPhotos)
        }
      } catch (err) {
        console.error('Error loading portfolio photos:', err)
        toast.error('Failed to load portfolio photos.')
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [workerProfileId])

  const handleUploadClick = () => {
    if (!workerProfileId) {
      toast.warning('Please click "Save Profile Changes" at the bottom to create your profile before uploading photos!')
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !workerProfileId) return

    setUploading(true)
    const supabase = createClient()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" is too large (max. 5MB)`)
        continue
      }

      try {
        const fileExt = file.name.split('.').pop()
        const fileId = Math.random().toString(36).substring(2, 15)
        const filePath = `${userId}/${fileId}.${fileExt}`

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('portfolio_photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio_photos')
          .getPublicUrl(filePath)

        // 3. Save to DB table portfolio_photos
        const { data: inserted, error: dbError } = await supabase
          .from('portfolio_photos')
          .insert({
            worker_profile_id: workerProfileId,
            storage_path: publicUrl,
            caption: file.name.substring(0, file.name.lastIndexOf('.')) || 'Portfolio upload',
          })
          .select()
          .single()

        if (dbError) throw dbError

        if (inserted) {
          const mappedPhoto: PortfolioPhoto = {
            id: inserted.id,
            worker_profile_id: inserted.worker_profile_id || '',
            storage_path: inserted.storage_path,
            caption: inserted.caption,
            uploaded_at: inserted.uploaded_at || new Date().toISOString(),
          }
          setPhotos((prev) => [...prev, mappedPhoto])
          toast.success(`Successfully uploaded ${file.name}`)
        }
      } catch (err) {
        console.error('Upload error:', err)
        toast.error(`Failed to upload ${file.name}`)
      }
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemove = async (photoId: string, storagePathUrl: string) => {
    try {
      const supabase = createClient()

      // 1. Delete from DB
      const { error: dbError } = await supabase
        .from('portfolio_photos')
        .delete()
        .eq('id', photoId)

      if (dbError) throw dbError

      // 2. Delete from Storage (extract path from URL)
      const urlParts = storagePathUrl.split('/portfolio_photos/')
      if (urlParts.length > 1) {
        const storagePath = decodeURIComponent(urlParts[1])
        const { error: storageError } = await supabase.storage
          .from('portfolio_photos')
          .remove([storagePath])
        if (storageError) {
          console.warn('Storage deletion failed or file already deleted:', storageError)
        }
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
      toast.info('Photo removed')
    } catch (err) {
      console.error('Removal error:', err)
      toast.error('Failed to remove photo')
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Upload Zone */}
      <div 
        onClick={handleUploadClick}
        className={`w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 transition-colors cursor-pointer ${
          !workerProfileId 
            ? 'opacity-65 cursor-not-allowed hover:bg-slate-50 hover:border-slate-300' 
            : 'hover:bg-slate-100 hover:border-blue-400'
        }`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
          !workerProfileId ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'
        }`}>
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
        </div>
        <p className="text-sm font-semibold text-slate-700">
          {!workerProfileId ? 'Save profile first to upload' : 'Click to upload photos'}
        </p>
        <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
        {!workerProfileId && (
          <p className="text-xs text-amber-600 font-medium mt-2 bg-amber-50 px-2.5 py-1 rounded-md">
            ⚠️ You must save changes below to enable portfolio photo uploads.
          </p>
        )}
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading portfolio...
        </div>
      ) : (
        photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-200">
                <Image 
                  src={photo.storage_path} 
                  alt={photo.caption || 'Portfolio upload'} 
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(photo.id, photo.storage_path)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {/* Add more placeholder */}
            <button 
              type="button"
              onClick={handleUploadClick}
              className="aspect-square rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ImageIcon className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">Add more</span>
            </button>
          </div>
        )
      )}
    </div>
  )
}
