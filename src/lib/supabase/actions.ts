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
  WorkerType,
  CompanyProfile,
  AgencyProfile,
  PrivateProfile
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
  profession?: string
  experience?: string
  work_cities?: string[]
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
      country: 'uk',
      profession: data.profession || null,
      experience: data.experience || null,
      work_cities: data.work_cities || null
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

    // Sync user full_name and phone in auth/profiles if updated
    await supabase
      .from('profiles')
      .update({ 
        full_name: data.display_name || user.user_metadata?.full_name || '', 
        phone: data.contact_phone || user.user_metadata?.phone || '' 
      })
      .eq('id', user.id)

    revalidatePath('/masters')
    revalidatePath('/my/profile')
    return { success: true, id }
  } catch (error) {
    console.error('Error in upsertWorkerProfileAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// ─── COMPANY PROFILE ACTIONS ──────────────────────────────────────────────────

export async function getCompanyProfileByUserIdAction(userId: string): Promise<CompanyProfile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle()

    if (error) throw error
    return data as CompanyProfile | null
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getCompanyProfileByUserIdAction:', error)
    return null
  }
}

export async function upsertCompanyProfileAction(data: {
  company_name: string
  company_type?: string
  contact_name?: string
  contact_position?: string
  phone?: string
  email?: string
  website?: string
  city?: string
  postcode?: string
  founded_year?: number
  company_size?: string
  description?: string
  languages?: string[]
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const existing = await getCompanyProfileByUserIdAction(user.id)

    const payload = {
      profile_id: user.id,
      company_name: data.company_name,
      company_type: data.company_type || '',
      contact_name: data.contact_name || '',
      contact_position: data.contact_position || '',
      phone: data.phone || '',
      email: data.email || user.email || '',
      website: data.website || '',
      city: data.city || '',
      postcode: data.postcode || '',
      founded_year: data.founded_year || null,
      company_size: data.company_size || '',
      description: data.description || '',
      languages: data.languages || existing?.languages || ['English'],
    }

    let error
    let id = existing?.id
    if (existing) {
      const { error: err } = await supabase
        .from('company_profiles')
        .update(payload)
        .eq('id', existing.id)
      error = err
    } else {
      const { data: inserted, error: err } = await supabase
        .from('company_profiles')
        .insert(payload)
        .select()
        .single()
      error = err
      if (inserted) {
        id = inserted.id
      }
    }

    if (error) throw error

    // Sync user full_name and phone in auth/profiles if updated
    await supabase
      .from('profiles')
      .update({ 
        full_name: data.contact_name || user.user_metadata?.full_name || '', 
        phone: data.phone || user.user_metadata?.phone || '' 
      })
      .eq('id', user.id)

    revalidatePath('/my/profile')
    return { success: true, id }
  } catch (error) {
    console.error('Error in upsertCompanyProfileAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// ─── AGENCY PROFILE ACTIONS ───────────────────────────────────────────────────

export async function getAgencyProfileByUserIdAction(userId: string): Promise<AgencyProfile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('agency_profiles')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle()

    if (error) throw error
    return data as AgencyProfile | null
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getAgencyProfileByUserIdAction:', error)
    return null
  }
}

export async function upsertAgencyProfileAction(data: {
  agency_name: string
  contact_name?: string
  contact_position?: string
  phone?: string
  email?: string
  website?: string
  registration_number?: string
  description?: string
  contract_types?: string[]
  specializations?: string[]
  regions?: string[]
  languages?: string[]
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const existing = await getAgencyProfileByUserIdAction(user.id)

    const payload = {
      profile_id: user.id,
      agency_name: data.agency_name,
      contact_name: data.contact_name || '',
      contact_position: data.contact_position || '',
      phone: data.phone || '',
      email: data.email || user.email || '',
      website: data.website || '',
      registration_number: data.registration_number || '',
      description: data.description || '',
      contract_types: data.contract_types || existing?.contract_types || ['CIS'],
      specializations: data.specializations || existing?.specializations || [],
      regions: data.regions || existing?.regions || ['London'],
      languages: data.languages || existing?.languages || ['English'],
    }

    let error
    let id = existing?.id
    if (existing) {
      const { error: err } = await supabase
        .from('agency_profiles')
        .update(payload)
        .eq('id', existing.id)
      error = err
    } else {
      const { data: inserted, error: err } = await supabase
        .from('agency_profiles')
        .insert(payload)
        .select()
        .single()
      error = err
      if (inserted) {
        id = inserted.id
      }
    }

    if (error) throw error

    // Sync user full_name and phone in auth/profiles if updated
    await supabase
      .from('profiles')
      .update({ 
        full_name: data.contact_name || user.user_metadata?.full_name || '', 
        phone: data.phone || user.user_metadata?.phone || '' 
      })
      .eq('id', user.id)

    revalidatePath('/my/profile')
    return { success: true, id }
  } catch (error) {
    console.error('Error in upsertAgencyProfileAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// ─── PRIVATE PROFILE ACTIONS ──────────────────────────────────────────────────

export async function getPrivateProfileByUserIdAction(userId: string): Promise<PrivateProfile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('private_profiles')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle()

    if (error) throw error
    return data as PrivateProfile | null
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getPrivateProfileByUserIdAction:', error)
    return null
  }
}

export async function upsertPrivateProfileAction(data: {
  display_name: string
  phone?: string
  city?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const existing = await getPrivateProfileByUserIdAction(user.id)

    const payload = {
      profile_id: user.id,
      display_name: data.display_name,
      phone: data.phone || '',
      city: data.city || '',
    }

    let error
    let id = existing?.id
    if (existing) {
      const { error: err } = await supabase
        .from('private_profiles')
        .update(payload)
        .eq('id', existing.id)
      error = err
    } else {
      const { data: inserted, error: err } = await supabase
        .from('private_profiles')
        .insert(payload)
        .select()
        .single()
      error = err
      if (inserted) {
        id = inserted.id
      }
    }

    if (error) throw error

    // Sync user full_name and phone in auth/profiles if updated
    await supabase
      .from('profiles')
      .update({ 
        full_name: data.display_name || user.user_metadata?.full_name || '', 
        phone: data.phone || user.user_metadata?.phone || '' 
      })
      .eq('id', user.id)

    revalidatePath('/my/profile')
    return { success: true, id }
  } catch (error) {
    console.error('Error in upsertPrivateProfileAction:', error)
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

// ─── SHORT WORK ACTIONS ──────────────────────────────────────────────────────

export async function createShortWorkAction(data: {
  service_type: string
  title: string
  description?: string
  photos?: string[]
  address?: string
  city?: string
  postcode?: string
  budget_type?: string
  budget_amount?: number
  payment_method?: string
  urgency?: string
  preferred_date?: string
  preferred_time?: string
  contact_name: string
  contact_phone: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const payload = {
      profile_id: user.id,
      service_type: data.service_type,
      title: data.title,
      description: data.description || null,
      photos: data.photos || [],
      address: data.address || null,
      city: data.city || null,
      postcode: data.postcode || null,
      budget_type: data.budget_type || null,
      budget_amount: data.budget_amount || null,
      payment_method: data.payment_method || null,
      urgency: data.urgency || null,
      preferred_date: data.preferred_date || null,
      preferred_time: data.preferred_time || null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      status: 'published'
    }

    const { data: inserted, error } = await supabase
      .from('short_work_listings')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/hourly')
    revalidatePath('/my/short-work')
    return { success: true, id: inserted.id }
  } catch (error) {
    console.error('Error in createShortWorkAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function getMyShortWorkListingsAction() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('short_work_listings')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getMyShortWorkListingsAction:', error)
    return []
  }
}

export async function getPublicShortWorkListingsAction(filters?: {
  service_type?: string
  city?: string
  urgency?: string
}) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('short_work_listings')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters?.service_type) {
      query = query.eq('service_type', filters.service_type)
    }
    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`)
    }
    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getPublicShortWorkListingsAction:', error)
    return []
  }
}

export async function getShortWorkListingByIdAction(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('short_work_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Error in getShortWorkListingByIdAction:', error)
    return null
  }
}

export async function updateShortWorkListingStatusAction(id: string, status: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('short_work_listings')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    revalidatePath('/my/short-work')
    revalidatePath('/hourly')
    return { success: true }
  } catch (error) {
    console.error('Error in updateShortWorkListingStatusAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function updateShortWorkAction(id: string, data: {
  service_type: string
  title: string
  description?: string
  photos?: string[]
  address?: string
  city?: string
  postcode?: string
  budget_type?: string
  budget_amount?: number
  payment_method?: string
  urgency?: string
  preferred_date?: string
  preferred_time?: string
  contact_name: string
  contact_phone: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const payload = {
      service_type: data.service_type,
      title: data.title,
      description: data.description || null,
      photos: data.photos || [],
      address: data.address || null,
      city: data.city || null,
      postcode: data.postcode || null,
      budget_type: data.budget_type || null,
      budget_amount: data.budget_amount || null,
      payment_method: data.payment_method || null,
      urgency: data.urgency || null,
      preferred_date: data.preferred_date || null,
      preferred_time: data.preferred_time || null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
    }

    const { data: updated, error } = await supabase
      .from('short_work_listings')
      .update(payload)
      .eq('id', id)
      .eq('profile_id', user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/hourly')
    revalidatePath(`/hourly/${id}`)
    revalidatePath('/my/short-work')
    return { success: true, id: updated.id }
  } catch (error) {
    console.error('Error in updateShortWorkAction:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

