"use client";

/**
 * Distribution Map Component
 *
 * Visualizes distribution network using a dynamic Leaflet map.
 * Data is now passed via props instead of hardcoded.
 * Validated with Zod for type safety.
 */

import dynamic from "next/dynamic";
import { z } from "zod";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

export const DistributionLocationSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  radius: z.number().optional().default(50000),
});

const DistributionMapPropsSchema = z.object({
  heading: z.string().optional(),
  locations: z.array(DistributionLocationSchema).optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type DistributionLocation = z.infer<typeof DistributionLocationSchema>;
export type DistributionMapProps = z.infer<typeof DistributionMapPropsSchema>;

// =============================================================================
// LAZY LOADED COMPONENTS
// =============================================================================

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-beige animate-pulse flex items-center justify-center text-(--color-muted)">
      <span className="sr-only">Loading Map...</span>
      <svg className="w-8 h-8 animate-spin text-gold" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  ),
});

// =============================================================================
// COMPONENT
// =============================================================================

export default function DistributionMap({
  heading = "Our Reach",
  locations = [],
}: DistributionMapProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    const result = DistributionMapPropsSchema.safeParse({ heading, locations });
    if (!result.success) {
      console.warn("[DistributionMap] Prop validation warning:", result.error.flatten());
    }
  }

  // Fallback data if no locations provided (maintains existing behavior for now)
  const displayLocations =
    locations.length > 0
      ? locations
      : [
          { name: "Delhi NCR", lat: 28.6139, lng: 77.209, radius: 40000 },
          { name: "Punjab", lat: 31.1471, lng: 75.3412, radius: 70000 },
          { name: "Haryana", lat: 29.0588, lng: 76.0856, radius: 60000 },
        ];

  return (
    <div className="relative w-full h-96 bg-beige rounded-lg overflow-hidden shadow-md group isolate">
      {heading ? (
        <div className="absolute top-4 left-4 z-1000 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm pointer-events-none">
          <h4 className="font-bold text-deep-brown">{heading}</h4>
        </div>
      ) : null}

      {/* Regions Overlay */}
      <div className="absolute bottom-4 left-4 z-1000 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-sand max-w-[200px] pointer-events-none">
        <h5 className="text-sm font-bold text-deep-brown mb-2 uppercase tracking-wider">
          Key Regions
        </h5>
        <ul className="space-y-2">
          {displayLocations.map((loc) => (
            <li
              key={loc.name}
              className="flex items-center gap-2 text-sm font-medium text-(--color-slate)"
            >
              <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
              {loc.name}
            </li>
          ))}
        </ul>
      </div>

      <LeafletMap locations={displayLocations} />
    </div>
  );
}
