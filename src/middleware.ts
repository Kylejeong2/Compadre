import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)', '/api/(.*)'])
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
const isProfileRoute = createRouteMatcher(['/dashboard/profile/(.*)'])
const isWebhookRoute = createRouteMatcher(['/api/webhook(.*)'])

export default clerkMiddleware((auth, req) => {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')

  if (isWebhookRoute(req)) {
    // Allow webhook requests to pass through without authentication
    return
  }

  if (isApiRoute || (isProtectedRoute(req) && !isPublicRoute(req))) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}