"use client";

/**
 * Global Error Boundary
 * Catches errors at the root layout level when no other error boundary handles them.
 * This component must be self-contained as it serves as a fallback when the app crashes.
 * It cannot fetch from CMS as the error may be network-related.
 */

import { useEffect, useCallback } from "react";

import { Button } from "@/components/ui/Button";

// =============================================================================
// STATIC FALLBACK CONTENT
// These are intentionally hardcoded as this is a last-resort fallback
// =============================================================================

const ERROR_CONTENT = {
  title: "Something went wrong!",
  subtitle: "We encountered an unexpected error.",
  buttonText: "Try again",
  supportText: "If the problem persists, please contact support.",
} as const;

// =============================================================================
// GLOBAL ERROR COMPONENT (CLIENT COMPONENT - Required)
// =============================================================================

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error for monitoring
    console.error("[Global Error]", error);
  }, [error]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4 text-center">
        <div role="alert" aria-live="assertive" className="max-w-md">
          <h1 className="mb-2 text-4xl font-bold font-heading text-deep-brown">
            {ERROR_CONTENT.title}
          </h1>
          <p className="mb-6 text-lg text-(--color-muted)">{ERROR_CONTENT.subtitle}</p>

          <Button onClick={handleReset} variant="default" size="lg" type="button">
            {ERROR_CONTENT.buttonText}
          </Button>

          <p className="mt-8 text-sm text-(--color-muted)">{ERROR_CONTENT.supportText}</p>

          {/* Error digest for support reference */}
          {error.digest ? (
            <p className="mt-4 text-xs text-(--color-muted)">
              Error ID: <code className="font-mono">{error.digest}</code>
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
