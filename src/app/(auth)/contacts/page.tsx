"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ContactsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if this is being triggered by a redirect from dashboard tab
  // If we have a "source=tab" param, don't redirect again to prevent loops
  const isFromTab = searchParams.has("source");

  useEffect(() => {
    if (!isFromTab) {
      // Redirect to dashboard with contacts tab selected and with a source param to prevent loops
      router.push("/dashboard?tab=contacts&source=redirect");
    }
  }, [isFromTab, router]);

  // If we're coming from tabs, this should never render
  // If we're navigating directly to /contacts, show loading until redirect
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse text-xl">Redirecting to dashboard...</div>
    </div>
  );
} 