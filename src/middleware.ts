import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // --- Auth Pages Redirection (For Logged In Users) ---
  if (user && (pathname === '/login' || pathname === '/register')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'worker'
    const url = request.nextUrl.clone()
    
    if (role === 'company' || role === 'agency') {
      url.pathname = '/my/listings'
    } else if (role === 'worker') {
      url.pathname = '/my/profile'
    } else if (role === 'private') {
      url.pathname = '/my/short-work'
    } else if (role === 'admin') {
      url.pathname = '/admin'
    } else {
      url.pathname = '/my/profile'
    }
    return NextResponse.redirect(url)
  }

  // --- Route Protection ---
  const isProtected = pathname.startsWith('/my') || pathname.startsWith('/admin')

  if (isProtected) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(url)
    }

    // Fetch user profile and role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'worker'
    const url = request.nextUrl.clone()

    // Define dashboard page for current user role
    let dashboardPath = '/my/profile'
    if (role === 'company' || role === 'agency') {
      dashboardPath = '/my/listings'
    } else if (role === 'private') {
      dashboardPath = '/my/short-work'
    } else if (role === 'admin') {
      dashboardPath = '/admin'
    }

    // Enforce role-based restrictions
    // 1. /my/post-job and /my/listings -> only Company and Agency
    if ((pathname.startsWith('/my/post-job') || pathname.startsWith('/my/listings')) && role !== 'company' && role !== 'agency') {
      url.pathname = dashboardPath
      return NextResponse.redirect(url)
    }

    // 2. /my/create-profile and /my/profile -> only Worker
    if ((pathname.startsWith('/my/create-profile') || pathname.startsWith('/my/profile')) && role !== 'worker') {
      url.pathname = dashboardPath
      return NextResponse.redirect(url)
    }

    // 3. /my/short-work -> only Private
    if (pathname.startsWith('/my/short-work') && role !== 'private') {
      url.pathname = dashboardPath
      return NextResponse.redirect(url)
    }

    // 4. /my/saved -> only Worker
    if (pathname.startsWith('/my/saved') && role !== 'worker') {
      url.pathname = dashboardPath
      return NextResponse.redirect(url)
    }

    // 5. /admin -> only Admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = dashboardPath
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
