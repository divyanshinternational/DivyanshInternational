"use client";

import { useEffect, useState, useCallback } from "react";
import { z } from "zod";

import { browserClient } from "@/lib/sanity/client-browser";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const errorSettingsSchema = z.object({
  genericErrorTitle: z.string().optional(),
  genericErrorText: z.string().optional(),
  tryAgainButton: z.string().optional(),
});

type ErrorSettings = z.infer<typeof errorSettingsSchema>;

// =============================================================================
// DEFAULT FALLBACK VALUES
// =============================================================================

const DEFAULTS: ErrorSettings = {
  genericErrorTitle: "Something went wrong",
  genericErrorText:
    "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  tryAgainButton: "Try Again",
} as const;

// =============================================================================
// ERROR COMPONENT PROPS
// =============================================================================

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// =============================================================================
// ERROR BOUNDARY COMPONENT
// =============================================================================

export default function ErrorBoundary({ error, reset }: ErrorComponentProps) {
  const [errorSettings, setErrorSettings] = useState<ErrorSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log error for debugging/monitoring
    console.error("[Error Boundary] Caught error:", error);

    // Fetch error settings from CMS
    browserClient
      .fetch(siteSettingsQuery)
      .then((settings: unknown) => {
        if (settings && typeof settings === "object" && "error" in settings) {
          const result = errorSettingsSchema.safeParse((settings as { error: unknown }).error);
          if (result.success) {
            setErrorSettings({
              genericErrorTitle: result.data.genericErrorTitle ?? DEFAULTS.genericErrorTitle,
              genericErrorText: result.data.genericErrorText ?? DEFAULTS.genericErrorText,
              tryAgainButton: result.data.tryAgainButton ?? DEFAULTS.tryAgainButton,
            });
          }
        }
      })
      .catch((fetchError: unknown) => {
        console.error("[Error Boundary] Failed to fetch error settings:", fetchError);
        // Keep using defaults on fetch failure
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [error]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  // Show minimal loading state while fetching settings
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center"
        role="alert"
        aria-busy="true"
      >
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-sand rounded mb-4" />
          <div className="h-4 w-48 bg-sand rounded mb-8 mx-auto" />
          <div className="h-12 w-32 bg-sand rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background pt-[72px] md:pt-24 px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <h2 className="text-3xl font-bold text-deep-brown mb-4 font-heading">
        {errorSettings.genericErrorTitle}
      </h2>
      <p className="text-foreground mb-8 max-w-md">{errorSettings.genericErrorText}</p>
      <button
        onClick={handleReset}
        className="px-8 py-3 bg-gold text-white rounded-full font-semibold hover:bg-gold-dark transition-colors shadow-lg focus:outline-2 focus:outline-gold-dark focus:outline-offset-2"
        type="button"
      >
        {errorSettings.tryAgainButton}
      </button>
      {/* Include error digest for support reference if available */}
      {error.digest ? (
        <p className="mt-6 text-sm text-(--color-muted)">
          Error ID: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
    </div>
  );
}
