/**
 * SignUpPage Component
 * 
 * The registration page for the application using Clerk Authentication.
 * Provides options for email sign-up and social login.
 * 
 * @module app/(auth)/sign-up
 */

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

/**
 * SignUpPage Component
 * 
 * @returns The sign-up page with Clerk auth UI and GitHub registration option
 */
export default function SignUpPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
            DeathNote
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;This app helped me prepare thoughtful messages for my loved ones, giving me peace of mind that they&apos;ll receive them when it matters most.&quot;
            </p>
            <footer className="text-sm">Michael Wilson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
          <SignUp 
            appearance={{
              elements: {
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 w-full",
                    footerActionLink: "text-primary hover:text-primary/90",
                    card: "shadow-none",
                    header: "hidden",
                    footer: {
                      justifyContent: "center",
                      textAlign: "center",
                    }
              }
            }}
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
          />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
        </div>
      </div>
            <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
} 