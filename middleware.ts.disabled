// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Only run on real routes; skip assets, api, and Vercel internals
export const config = {
  matcher: ['/((?!_next|api|_vercel|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)'],
}

export default function middleware(req: NextRequest) {
  try {
    // If you had host redirects, keep them minimal & null-safe, e.g.:
    // const host = req.headers.get('host') || ''
    // if (host === 'kittie.so') {
    //   const url = new URL(req.url)
    //   url.hostname = 'www.kittie.so'
    //   return NextResponse.redirect(url)
    // }
    return NextResponse.next()
  } catch {
    // Never throw from middleware in prod
    return NextResponse.next()
  }
}
