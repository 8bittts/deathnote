/**
 * Authentication and Request Enrichment Middleware
 * 
 * This middleware handles several key aspects of the application:
 * 1. Authentication via Clerk
 * 2. Request routing based on authentication state
 * 3. Enriching API requests with user information for personalization
 * 
 * @module middleware
 */

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Clerk middleware to handle authentication and request enrichment
 * 
 * This middleware runs on all requests and performs several functions:
 * 1. Checks if a user is authenticated
 * 2. Redirects authenticated users from the homepage to the dashboard
 * 3. Allows public routes to be accessed without authentication
 * 4. Protects all other routes by requiring authentication
 * 5. Adds user information to API requests as headers for personalization
 * 
 * @param auth The Clerk authentication object
 * @param req The incoming request
 * @returns The original request, a redirect, or a modified request with added headers
 */
export default clerkMiddleware(async (auth, req) => {
  try {
    // Get authentication state
    const { userId } = await auth();
    
    // If the user is authenticated and trying to access the homepage,
    // redirect them to the dashboard
    if (userId && req.nextUrl.pathname === '/') {
      const dashboardUrl = new URL('/dashboard', req.url);
      return Response.redirect(dashboardUrl);
    }
    
    // For API routes, add user information as headers if available
    if (userId && req.nextUrl.pathname.startsWith('/api/')) {
      return enrichApiRequestWithUserInfo(auth, req);
    }
    
    // For all other routes, let Clerk handle authentication
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error in the middleware, still allow the request to proceed
    // but don't add any user information
    return NextResponse.next();
  }
});

/**
 * Enriches API requests with user information from Clerk
 * 
 * @param auth The Clerk authentication object
 * @param req The incoming request
 * @returns A new request with user information added as headers
 */
async function enrichApiRequestWithUserInfo(auth: any, req: Request) {
  try {
    // Get the full auth object with session claims
    const authObject = await auth();
    
    // Clone the request headers
    const requestHeaders = new Headers(req.headers);
    
    // Add user information to headers if available
    if (authObject.userId) {
      // Extract user data from the session claims
      const firstName = authObject.sessionClaims?.firstName as string || '';
      const lastName = authObject.sessionClaims?.lastName as string || '';
      
      // Create a full name if either first or last name is available
      const fullName = firstName && lastName 
        ? `${firstName} ${lastName}`
        : firstName || lastName || '';
        
      // Add user information to headers
      if (fullName) {
        requestHeaders.set('x-user-name', fullName);
      }
      
      requestHeaders.set('x-user-id', authObject.userId);
      
      // Create a new request with the updated headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  } catch (error) {
    // Log the error but continue processing the request
    console.error('Error adding user info to headers:', error);
  }
  
  // If we can't add user info, just continue with the original request
  return NextResponse.next();
}

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