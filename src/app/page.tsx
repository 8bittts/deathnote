/**
 * Home Page Component
 * 
 * The landing page for non-authenticated users with information about the application.
 * Authenticated users are automatically redirected to their dashboard.
 * 
 * @module app/page
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Home Page Component
 * 
 * @returns The landing page with information for non-authenticated users
 */
export default function Home() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (isLoaded && userId) {
      router.replace("/dashboard");
    }
  }, [isLoaded, userId, router]);
  
  // If still loading authentication, show a loading state
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  // If the user is authenticated, we don't need to render anything
  // as they will be redirected to dashboard
  if (userId) {
    return null;
  }

  // Only show the homepage for non-authenticated users
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="text-2xl font-bold">DeathNote</div>
        <div className="flex gap-4 items-center">
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto flex-1 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Your final messages,
            <span className="block mt-2 text-blue-500">delivered only</span> when needed
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Create and securely store private notes that will be shared with your
            loved ones only when the time comes.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="lg">
                Create Your Note
                <span className="ml-2">→</span>
              </Button>
            </SignUpButton>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How DeathNote Works</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            A thoughtful, secure way to share your final messages with loved ones.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="m3 17 2 2 4-4" />
                  <path d="m3 7 2 2 4-4" />
                  <rect width="12" height="4" x="8" y="5" rx="1" />
                  <rect width="12" height="4" x="8" y="15" rx="1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Note</h3>
              <p className="text-muted-foreground">
                Write a personal note with instructions, messages, or anything you want to share
                with your loved ones when you&apos;re no longer here.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure &amp; Private</h3>
              <p className="text-muted-foreground">
                Your note remains completely private and encrypted. Only you can access it until
                the verification period lapses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Proof of Life</h3>
              <p className="text-muted-foreground">
                Respond to periodic verification emails to confirm you&apos;re still here. If you don&apos;t
                respond, your note will be shared with your designated recipients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
