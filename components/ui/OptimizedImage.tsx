"use client";

/**
 * Optimized Image Component
 *
 * A wrapper around next/image with a loading skeleton and smooth appear transition.
 * Handles both fixed dimensions and fill layout.
 *
 * Props validated with Zod for runtime safety during development.
 */

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const OptimizedImagePropsSchema = z.object({
  src: z.string().min(1, "Image source is required"),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  className: z.string().optional(),
  containerClassName: z.string().optional(),
  imageClassName: z.string().optional(),
  priority: z.boolean().optional(),
  fill: z.boolean().optional(),
  sizes: z.string().optional(),
  quality: z.number().min(1).max(100).optional(),
  onLoad: z.any().optional(),
  onError: z.any().optional(),
  overflowVisible: z.boolean().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type OptimizedImageProps = z.infer<typeof OptimizedImagePropsSchema>;

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: OptimizedImageProps) {
  if (process.env.NODE_ENV === "development") {
    const result = OptimizedImagePropsSchema.safeParse(props);
    if (!result.success) {
      console.warn("[OptimizedImage] Prop validation warning:", result.error.flatten());
    }

    // Additional check for width/height vs fill
    if (!props.fill && (!props.width || !props.height)) {
      console.warn("[OptimizedImage] If 'fill' is false, 'width' and 'height' must be provided.");
    }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  imageClassName,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  onLoad,
  onError,
  overflowVisible = false,
}: OptimizedImageProps) {
  // Validate props in dev
  validateProps({
    src,
    alt,
    width,
    height,
    className,
    containerClassName,
    imageClassName,
    priority,
    fill,
    sizes,
    quality,
    onLoad,
    onError,
    overflowVisible,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative",
        !overflowVisible && "overflow-hidden",
        fill && "w-full h-full",
        containerClassName || className
      )}
    >
      {!isLoaded ? (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-[inherit]"
          aria-hidden="true"
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
        fill={fill}
        {...(sizes ? { sizes } : {})}
        quality={quality}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          imageClassName
        )}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={onError}
      />
    </div>
  );
}
