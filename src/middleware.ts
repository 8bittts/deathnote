/**
 * Authentication Middleware
 * 
 * This middleware handles user authentication using Clerk.
 * It ensures protected routes require authentication and handles redirects.
 * 
 * @module middleware
 */

import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Clerk middleware to handle authentication and redirects
 * 
 * This middleware:
 * 1. Checks if a user is authenticated
 * 2. Redirects authenticated users from the homepage to the dashboard
 * 3. Allows public routes to be accessed without authentication
 * 4. Protects all other routes by requiring authentication
 */
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

/**
 * Middleware matcher configuration
 * 
 * Defines which routes the middleware should run on:
 * - Excludes Next.js internal routes and static files
 * - Includes all API routes
 */
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|api|trpc).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 