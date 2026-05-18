"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { capturePageView, initPosthog } from "@/lib/analytics";

function PosthogPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPosthog();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const q = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${q ? `?${q}` : ""}`;
    capturePageView(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * One-time PostHog init + `$pageview` on navigations (`capture_pageview` is off in init).
 * Wrapped in `Suspense` because `useSearchParams` requires it in the App Router layout.
 */
export function PosthogAnalytics() {
  return (
    <Suspense fallback={null}>
      <PosthogPageViewInner />
    </Suspense>
  );
}
