/**
 * Global Website Loading Skeleton
 * Displays animated nut spinner while page content is loading
 */

import { NutIcon } from "@/components/assets/Decorations";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-background"
      role="status"
      aria-label="Loading page content"
    >
      <div className="relative w-24 h-24">
        {/* Static background ring */}
        <div
          className="absolute inset-0 border-4 border-almond-gold/30 rounded-full"
          aria-hidden="true"
        />
        {/* Animated spinning ring */}
        <div
          className="absolute inset-0 border-4 border-almond-gold border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        {/* Pulsing nut icon */}
        <div
          className="absolute inset-0 flex items-center justify-center animate-pulse"
          aria-hidden="true"
        >
          <NutIcon className="w-10 h-10 text-almond-gold" />
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
