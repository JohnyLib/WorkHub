// ─── Database Row Types ────────────────────────────────────────────────────

export type UserRole = 'company' | 'agency' | 'worker' | 'private' | 'admin' | 'employer' | 'both'
export type PayType = 'day' | 'hour' | 'sqm' | 'negotiable'
export type ListingStatus = 'draft' | 'pending' | 'published' | 'expired'
export type WorkerType = 'master' | 'company' | 'agency'
export type Country = 'uk' | 'ie' | 'de'
export type Locale = 'en' | 'ru'
export type MessengerType = 'whatsapp' | 'telegram' | 'viber'
export type EmployerType = 'individual' | 'company' | 'agency'
export type PaymentMethod = 'cash' | 'bank' | 'both'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  onboarding_complete: boolean
  lang: Locale
  avatar_url: string | null
  country: Country
  is_verified: boolean
  created_at: string
  email?: string
}

export interface JobListing {
  id: string
  author_id: string
  country: Country
  profession: string
  workers_count: number
  location_area: string
  location_postcode: string | null
  pay_type: PayType | null
  pay_rate: number | null
  pay_period: string | null
  days_per_week: number | null
  hours_paid: number | null
  hours_onsite: number | null
  required_docs: string[]
  tools_provided: boolean
  contact_lang: string[]
  contact_name: string
  contact_phone: string | null
  contact_email: string | null
  messengers: MessengerType[]
  employer_type: EmployerType | null
  employer_name: string | null
  weekend_rate: string | null
  overtime_hours: number | null
  overtime_rate: string | null
  breaks_minutes: number | null
  project_duration: string | null
  payment_method: PaymentMethod | null
  site_language: string | null
  ppe_provided: string[]
  start_date: string | null
  extra_notes: string | null
  status: ListingStatus
  expires_at: string
  views_count: number
  created_at: string
  // Joined
  author?: Profile
}

export interface WorkerProfile {
  id: string
  profile_id: string
  type: WorkerType | null
  country: Country
  display_name: string
  logo_url: string | null
  founded_year: number | null
  team_size: string | null
  specializations: string[]
  work_areas: string[]
  languages: string[]
  bio: string | null
  certifications: string[]
  payment_methods: string[]
  works_remotely: boolean
  works_piecework: boolean
  website: string | null
  contact_phone: string | null
  contact_email: string | null
  messengers: string[]
  created_at: string
  profession?: string | null
  experience?: string | null
  work_cities?: string[] | null
  // Joined
  profile?: Profile
  portfolio_photos?: PortfolioPhoto[]
}

export interface CompanyProfile {
  id: string
  profile_id: string
  company_name: string
  company_type: string | null
  contact_name: string | null
  contact_position: string | null
  phone: string | null
  email: string | null
  website: string | null
  city: string | null
  postcode: string | null
  founded_year: number | null
  company_size: string | null
  logo_url: string | null
  description: string | null
  specializations: string[] | null
  regions: string[] | null
  languages: string[] | null
  messengers: any | null
  portfolio_photos: string[] | null
  created_at: string
}

export interface AgencyProfile {
  id: string
  profile_id: string
  agency_name: string
  contact_name: string | null
  contact_position: string | null
  phone: string | null
  email: string | null
  website: string | null
  rec_license: boolean | null
  registration_number: string | null
  description: string | null
  contract_types: string[] | null
  specializations: string[] | null
  regions: string[] | null
  languages: string[] | null
  logo_url: string | null
  created_at: string
}

export interface PrivateProfile {
  id: string
  profile_id: string
  display_name: string
  phone: string | null
  city: string | null
  created_at: string
}


export interface PortfolioPhoto {
  id: string
  worker_profile_id: string
  storage_path: string
  caption: string | null
  uploaded_at: string
}

export interface SavedListing {
  id: string
  profile_id: string
  listing_id: string
  saved_at: string
  listing?: JobListing
}

export interface Notification {
  id: string
  recipient_id: string
  type: string
  payload: Record<string, unknown>
  read_at: string | null
  created_at: string
}

// ─── Form Types ────────────────────────────────────────────────────────────

export interface JobFormData {
  // Step 1
  profession: string
  workers_count: number
  location_area: string
  location_postcode: string
  // Step 2
  pay_type: PayType
  pay_rate: number | null
  pay_period: string
  days_per_week: number | null
  hours_paid: number | null
  hours_onsite: number | null
  // Step 3
  required_docs: string[]
  tools_provided: boolean
  contact_lang: string[]
  ppe_provided: string[]
  start_date: string
  // Step 4
  contact_name: string
  contact_phone: string
  contact_email: string
  messengers: MessengerType[]
  extra_notes: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  full_name: string
  email: string
  password: string
  role: UserRole
}

// ─── UI / Filter Types ─────────────────────────────────────────────────────

export interface JobFilters {
  profession?: string
  location?: string
  pay_type?: PayType
  min_rate?: number
  max_rate?: number
  start_date?: string
}

export interface MockUser {
  id: string
  email: string
  role: UserRole
  full_name: string
  avatar_url: string | null
  country: Country
  is_verified: boolean
}
