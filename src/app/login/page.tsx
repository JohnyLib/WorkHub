'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { HardHat, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle, Zap } from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
const registerSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employer', 'worker', 'both']),
})
const magicSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

type Tab = 'login' | 'register' | 'magic'
type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>
type MagicData = z.infer<typeof magicSchema>

function InputField({ label, id, error, type = 'text', ...props }: {
  label: string; id: string; error?: string; type?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all min-h-[48px] ${
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-200'
              : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

interface FormProps {
  supabase: ReturnType<typeof createClient>
  router: ReturnType<typeof useRouter>
  returnUrl: string
}

function LoginForm({ supabase, router, returnUrl }: FormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema), mode: 'onBlur',
  })

  const onSubmit = async (data: LoginData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
      if (error) { toast.error(error.message) }
      else { toast.success('Welcome back!'); router.push(returnUrl); router.refresh() }
    } catch { toast.error('An unexpected error occurred.') }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <InputField label="Email Address" id="login-email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <InputField label="Password" id="login-password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
      <div className="text-right">
        <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</Link>
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
        {isSubmitting ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Signing in…</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  )
}

function RegisterForm({ supabase, router }: FormProps) {
  const [isRegisteredNeedVerify, setIsRegisteredNeedVerify] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema), mode: 'onBlur', defaultValues: { role: 'worker' },
  })

  const onSubmit = async (data: RegisterData) => {
    try {
      const { data: resData, error } = await supabase.auth.signUp({
        email: data.email, password: data.password,
        options: { data: { full_name: data.full_name, role: data.role, country: 'uk' } }
      })
      if (error) { 
        toast.error(error.message) 
      } else if (resData.user && !resData.session) {
        setIsRegisteredNeedVerify(true)
        setRegisteredEmail(data.email)
        toast.success('Registration successful! Please verify your email.')
      } else { 
        toast.success('Account created! Welcome to WorkBridge.')
        router.push('/my/profile')
        router.refresh() 
      }
    } catch { toast.error('An unexpected error occurred.') }
  }

  if (isRegisteredNeedVerify) {
    return (
      <div className="text-center py-6 animate-fade-in-up space-y-4">
        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Mail className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Verify your email address</h3>
          <p className="text-sm text-slate-500 mt-2 px-2 leading-relaxed">
            We&apos;ve sent a verification link to <strong className="text-slate-800">{registeredEmail}</strong>. 
            Click the link in the email to activate your account and log in.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500 leading-normal max-w-xs mx-auto">
          ⚠️ <strong>Don&apos;t see the email?</strong> Check your spam folder or wait 1-2 minutes for it to arrive.
        </div>
        <button
          onClick={() => setIsRegisteredNeedVerify(false)}
          className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold"
        >
          ← Back to Register
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <InputField label="Full Name" id="reg-name" placeholder="John Smith" error={errors.full_name?.message} {...register('full_name')} />
      <InputField label="Email Address" id="reg-email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <InputField label="Password" id="reg-password" type="password" placeholder="Min. 6 characters" error={errors.password?.message} {...register('password')} />
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">I want to *</label>
        <div className="grid grid-cols-3 gap-2">
          {(['employer', 'worker', 'both'] as const).map((r) => (
            <label key={r} className="relative cursor-pointer">
              <input type="radio" value={r} {...register('role')} className="sr-only peer" />
              <div className="text-center px-2 py-3 text-xs font-semibold border-2 border-slate-200 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 text-slate-500 hover:border-slate-300 transition-all capitalize">
                {r === 'employer' ? '🏗️ Employer' : r === 'worker' ? '👷 Worker' : '🤝 Both'}
              </div>
            </label>
          ))}
        </div>
        {errors.role && <p className="mt-1 text-xs text-red-500 font-medium">{errors.role.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-60 min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
        {isSubmitting ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Creating account…</> : <>Create Free Account <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  )
}

function MagicLinkForm({ supabase }: { supabase: FormProps['supabase'] }) {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MagicData>({
    resolver: zodResolver(magicSchema), mode: 'onBlur',
  })

  const onSubmit = async (data: MagicData) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) { toast.error(error.message) }
      else { setSent(true) }
    } catch { toast.error('An unexpected error occurred.') }
  }

  if (sent) {
    return (
      <div className="text-center py-8 animate-fade-in-up">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">Check your email!</h3>
        <p className="text-sm text-slate-500">We&apos;ve sent a sign-in link to your inbox.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-sm text-slate-500">Enter your email and we&apos;ll send you a one-click sign-in link. No password needed.</p>
      <InputField label="Email Address" id="magic-email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-60 min-h-[52px] flex items-center justify-center gap-2">
        {isSubmitting ? 'Sending…' : <><Zap className="w-4 h-4" /> Send Magic Link</>}
      </button>
    </form>
  )
}

function LoginPageInner() {
  const [tab, setTab] = useState<Tab>('login')
  const [showMagic, setShowMagic] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams?.get('returnUrl') || '/my/profile'

  // Synchronize tab with searchParams using derived state pattern
  const urlTab = searchParams?.get('tab') as Tab | null
  const [prevUrlTab, setPrevUrlTab] = useState<Tab | null>(null)
  if (urlTab !== prevUrlTab) {
    setPrevUrlTab(urlTab)
    if (urlTab && ['login', 'register'].includes(urlTab)) {
      setTab(urlTab)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
        },
      })
      if (error) {
        toast.error(error.message)
      }
    } catch {
      toast.error('An unexpected error occurred.')
    }
  }

  const TABS = [
    { id: 'login' as Tab,    label: 'Sign In',  icon: Lock },
    { id: 'register' as Tab, label: 'Register', icon: User },
  ]

  const TRUST = [
    'No spam, ever',
    'Free to register',
    'Secure & encrypted',
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F5F3FF 100%)' }}>
        {/* Background orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #DBEAFE, transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #EDE9FE, transparent 70%)' }} />

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl shadow-blue-500/30 mb-4">
              <HardHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {tab === 'login' ? 'Welcome back' : 'Join WorkBridge'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {tab === 'login' ? 'Sign in to your account' : 'Create a free account in seconds'}
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            {/* Tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6 gap-1">
              {TABS.map(({ id, label }) => (
                <button key={id} id={`auth-tab-${id}`} onClick={() => setTab(id)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all min-h-[40px] ${
                    tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Google Social Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full mb-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all min-h-[48px] flex items-center justify-center gap-2.5 shadow-sm hover:border-slate-300 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.39 3.66 1.48 7.56l3.75 2.91C6.11 7.02 8.84 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.56l3.66 2.84c2.14-1.97 3.75-4.87 3.75-8.64z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.23 10.47a7.22 7.22 0 0 1 0 3.06l-3.75 2.91A11.96 11.96 0 0 1 1 12c0-1.6.31-3.12.87-4.53l3.36 3z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.11.75-2.53 1.19-4.3 1.19-3.16 0-5.89-1.98-6.77-5.43L1.48 16.44C3.39 20.34 7.35 23 12 23z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-3 bg-white text-xs font-semibold text-slate-400 uppercase tracking-wider">
                or use email
              </span>
            </div>

            {tab === 'login' && <LoginForm supabase={supabase} router={router} returnUrl={returnUrl} />}
            {tab === 'register' && <RegisterForm supabase={supabase} router={router} returnUrl={returnUrl} />}

            {/* Magic link toggle */}
            <div className="mt-5 text-center">
              <button
                onClick={() => setShowMagic((v) => !v)}
                className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-medium"
              >
                {showMagic ? '↑ Hide' : '✨ Sign in with Magic Link instead'}
              </button>
              {showMagic && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                  <MagicLinkForm supabase={supabase} />
                </div>
              )}
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 mt-6">
            {TRUST.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}
