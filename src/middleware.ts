import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(['/', '/privacy', '/terms', '/contact']);

// This middleware handles authentication and redirects
export default clerkMiddleware(async (auth, req) => {
  // Get authentication state
  const { userId } = await auth();
  
  // If the user is authenticated and trying to access the homepage,
  // redirect them to the dashboard
  if (userId && req.nextUrl.pathname === '/') {
    const dashboardUrl = new URL('/dashboard', req.url);
    return Response.redirect(dashboardUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|api|trpc).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 