'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'
import type {
  JobListing,
  WorkerProfile,
  Profile,
  SavedListing,
  MessengerType,
  PayType,
  WorkerType
} from '@/types'

function isDynamicServerError(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.message.includes('Dynamic server usage') ||
      (err as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE' ||
      (err.message.includes('Route') && err.message.includes('rendered statically')))
  )
}

// ─── AUTH ACTIONS ────────────────────────────────────────────────────────────

export async function getCurrentUserAction(): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !profile) return null
    return {
      ...profile,
      email: user.email,
    } as Profile
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getCurrentUserAction:', error)
    return null
  }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

// ─── PROFILE ACTIONS ─────────────────────────────────────────────────────────

export async function updateProfileRoleAction(role: 'employer' | 'worker' | 'both') {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id)

    if (error) throw error
    revalidatePath('/my/profile')
    return { success: true }
  } catch (error) {
    console.error('Error in updateProfileRoleAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function getWorkerProfileByUserIdAction(userId: string): Promise<WorkerProfile | null> {
  try {
    const supabase = await createClient()
    const { data: workerProfile, error } = await supabase
      .from('worker_profiles')
      .select(`
        *,
        portfolio_photos (*)
      `)
      .eq('profile_id', userId)
      .maybeSingle()

    if (error) throw error
    return workerProfile as unknown as WorkerProfile | null
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getWorkerProfileByUserIdAction:', error)
    return null
  }
}

export async function upsertWorkerProfileAction(data: {
  type: WorkerType
  display_name: string
  bio: string
  specializations: string[]
  work_areas: string[]
  contact_phone: string
  contact_email?: string
  messengers?: string[]
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Find existing profile
    const existing = await getWorkerProfileByUserIdAction(user.id)

    const payload = {
      profile_id: user.id,
      type: data.type,
      display_name: data.display_name,
      bio: data.bio,
      specializations: data.specializations,
      work_areas: data.work_areas,
      languages: existing?.languages ?? ['English'],
      certifications: existing?.certifications ?? [],
      payment_methods: existing?.payment_methods ?? ['Bank Transfer'],
      works_remotely: existing?.works_remotely ?? false,
      works_piecework: existing?.works_piecework ?? true,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email ?? user.email ?? null,
      messengers: data.messengers ?? ['whatsapp'],
      country: 'uk'
    }

    let error
    let id = existing?.id
    if (existing) {
      const { error: err } = await supabase
        .from('worker_profiles')
        .update(payload)
        .eq('id', existing.id)
      error = err
    } else {
      const { data: inserted, error: err } = await supabase
        .from('worker_profiles')
        .insert(payload)
        .select()
        .single()
      error = err
      if (inserted) {
        id = inserted.id
      }
    }

    if (error) throw error
    revalidatePath('/masters')
    revalidatePath('/my/profile')
    return { success: true, id }
  } catch (error) {
    console.error('Error in upsertWorkerProfileAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// ─── JOB LISTING ACTIONS ─────────────────────────────────────────────────────

export async function createJobAction(data: {
  profession: string
  workers_count: number
  location_area: string
  location_postcode?: string
  pay_type: PayType
  pay_rate?: number
  days_per_week?: number
  hours_paid?: number
  required_docs: string[]
  tools_provided: boolean
  ppe_provided: string[]
  start_date?: string
  contact_name: string
  contact_phone?: string
  contact_email?: string
  messengers: MessengerType[]
  extra_notes?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // Expires in 30 days

    const payload = {
      author_id: user.id,
      country: 'uk',
      profession: data.profession,
      workers_count: data.workers_count,
      location_area: data.location_area,
      location_postcode: data.location_postcode || null,
      pay_type: data.pay_type,
      pay_rate: data.pay_rate || null,
      days_per_week: data.days_per_week || null,
      hours_paid: data.hours_paid || null,
      hours_onsite: data.hours_paid || null,
      required_docs: data.required_docs,
      tools_provided: data.tools_provided,
      ppe_provided: data.ppe_provided,
      start_date: data.start_date || null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone || null,
      contact_email: data.contact_email || null,
      messengers: data.messengers,
      employer_type: 'company', // default
      employer_name: data.contact_name,
      status: 'published',
      expires_at: expiryDate.toISOString(),
      views_count: 0
    }

    const { data: inserted, error } = await supabase
      .from('job_listings')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/jobs')
    revalidatePath('/my/listings')
    return { success: true, id: inserted.id }
  } catch (error) {
    console.error('Error in createJobAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

function normalizeJobListing(job: unknown): JobListing {
  if (!job) return job as unknown as JobListing
  const j = job as Record<string, unknown>
  return {
    ...j,
    required_docs: (j.required_docs as string[]) || [],
    ppe_provided: (j.ppe_provided as string[]) || [],
    messengers: (j.messengers as string[]) || [],
  } as unknown as JobListing
}

export async function getJobListingsAction(filters?: {
  profession?: string
  location?: string
  pay_type?: string
  min_rate?: number
}): Promise<JobListing[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('job_listings')
      .select(`
        *,
        author:profiles (*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters?.profession) {
      query = query.ilike('profession', `%${filters.profession}%`)
    }
    if (filters?.location) {
      query = query.ilike('location_area', `%${filters.location}%`)
    }
    if (filters?.pay_type) {
      query = query.eq('pay_type', filters.pay_type)
    }
    if (filters?.min_rate) {
      query = query.gte('pay_rate', filters.min_rate)
    }

    const { data, error } = await query
    if (error) throw error
    return ((data || []) as unknown as Record<string, unknown>[]).map(normalizeJobListing)
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getJobListingsAction:', error)
    return []
  }
}

export async function getJobByIdAction(id: string): Promise<JobListing | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('job_listings')
      .select(`
        *,
        author:profiles (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // Increment views count asynchronously
    const { error: rpcError } = await (supabase as unknown as { rpc: (name: string, args: { row_id: string }) => Promise<{ error: Error | null }> }).rpc('increment_views', { row_id: id })
    if (rpcError) {
      // fallback if RPC doesn't exist or fails
      await supabase
        .from('job_listings')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id)
    }

    return normalizeJobListing(data)
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getJobByIdAction:', error)
    return null
  }
}

export async function getMyJobsAction(): Promise<JobListing[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('job_listings')
      .select(`
        *,
        author:profiles (*)
      `)
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return ((data || []) as unknown as Record<string, unknown>[]).map(normalizeJobListing)
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getMyJobsAction:', error)
    return []
  }
}

// ─── SAVED LISTINGS ACTIONS ──────────────────────────────────────────────────

export async function getSavedListingsAction(): Promise<SavedListing[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('saved_listings')
      .select(`
        *,
        listing:job_listings (
          *,
          author:profiles (*)
        )
      `)
      .eq('profile_id', user.id)
      .order('saved_at', { ascending: false })

    if (error) throw error
    return ((data || []) as unknown as Record<string, unknown>[]).map((saved) => ({
      ...saved,
      listing: saved.listing ? normalizeJobListing(saved.listing) : undefined,
    })) as unknown as SavedListing[]
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getSavedListingsAction:', error)
    return []
  }
}

export async function toggleSaveListingAction(listingId: string): Promise<{ success: boolean; saved: boolean }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if already saved
    const { data: existing, error: checkError } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('profile_id', user.id)
      .eq('listing_id', listingId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existing) {
      const { error: delError } = await supabase
        .from('saved_listings')
        .delete()
        .eq('id', existing.id)

      if (delError) throw delError
      revalidatePath('/my/saved')
      return { success: true, saved: false }
    } else {
      const { error: insError } = await supabase
        .from('saved_listings')
        .insert({
          profile_id: user.id,
          listing_id: listingId,
          saved_at: new Date().toISOString()
        })

      if (insError) throw insError
      revalidatePath('/my/saved')
      return { success: true, saved: true }
    }
  } catch (error) {
    console.error('Error in toggleSaveListingAction:', error)
    return { success: false, saved: false }
  }
}

// ─── WORKER DIRECTORY ACTIONS ────────────────────────────────────────────────

export async function getWorkerProfilesAction(type?: string, search?: string): Promise<WorkerProfile[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('worker_profiles')
      .select(`
        *,
        profile:profiles (*),
        portfolio_photos (*)
      `)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error

    let results = (data || []) as unknown as WorkerProfile[]

    if (search) {
      const q = search.toLowerCase()
      results = results.filter((p) => {
        return (
          p.display_name.toLowerCase().includes(q) ||
          p.specializations.some((s) => s.toLowerCase().includes(q)) ||
          p.work_areas.some((a) => a.toLowerCase().includes(q))
        )
      })
    }

    return results
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getWorkerProfilesAction:', error)
    return []
  }
}

export async function getWorkerByIdAction(id: string): Promise<WorkerProfile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('worker_profiles')
      .select(`
        *,
        profile:profiles (*),
        portfolio_photos (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as unknown as WorkerProfile
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getWorkerByIdAction:', error)
    return null
  }
}
