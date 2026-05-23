'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { HardHat, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
})

type LoginData = z.infer<typeof loginSchema>

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
            aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
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

function LoginPageInner() {
  const [authError, setAuthError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams?.get('returnUrl') || null

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginData) => {
    setAuthError(null)
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Show auth errors (like "Invalid login credentials") below the fields
        if (error.message.includes('credentials') || error.message.includes('Email not confirmed')) {
          setAuthError('Неверный адрес электронной почты или пароль')
        } else {
          setAuthError(error.message)
        }
        return
      }

      if (authData.user) {
        // Fetch user profile to check the role and redirect correctly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()

        const userRole = profile?.role || 'worker'

        if (returnUrl) {
          router.push(returnUrl)
        } else {
          // Redirect based on role
          if (userRole === 'company' || userRole === 'agency') {
            router.push('/my/listings')
          } else if (userRole === 'worker') {
            router.push('/my/profile')
          } else if (userRole === 'private') {
            router.push('/my/short-work')
          } else if (userRole === 'admin') {
            router.push('/admin')
          } else {
            router.push('/my/profile')
          }
        }
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setAuthError('Произошла непредвиденная ошибка при входе.')
    }
  }

  return (
    <div className="w-full max-w-md relative z-10 animate-fade-in-up">
      {/* Logo and Headings */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl shadow-blue-500/30 mb-4">
          <HardHat className="w-8 h-8 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Вход в личный кабинет</h1>
        <p className="text-sm text-slate-500 mt-1">Введите свои данные для доступа к платформе</p>
      </div>

      <div className="card p-6 sm:p-8 bg-white border border-slate-100 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <InputField
            label="Email адрес"
            id="login-email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <InputField
            label="Пароль"
            id="login-password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {authError && (
            <div className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-xl p-3">
              ⚠️ {authError}
            </div>
          )}

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-semibold">
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Вход…
              </>
            ) : (
              <>
                Войти <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-semibold">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-bold">
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
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

        <Suspense>
          <LoginPageInner />
        </Suspense>
      </main>
    </>
  )
}
