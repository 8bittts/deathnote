"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if this is being triggered by a redirect from dashboard tab
  const isFromTab = searchParams.has("source");

  useEffect(() => {
    if (!isFromTab) {
      // Redirect to dashboard with editor tab selected and with a source param to prevent loops
      router.push("/dashboard?tab=editor&source=redirect");
    }
  }, [isFromTab, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse text-xl">Redirecting to dashboard...</div>
    </div>
  );
} 