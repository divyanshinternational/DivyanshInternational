"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface GalleryImage {
  _key: string;
  title?: string;
  category?: string;
  imageUrl?: string;
  aspectRatio?: "auto" | "tall" | "wide";
}

interface GalleryContentProps {
  data: {
    title?: string;
    description?: string;
    images?: GalleryImage[];
  };
}

// Inline SVG icons
const CloseIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={cn("animate-spin", className)} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function GalleryContent({ data }: GalleryContentProps) {
  const images = useMemo(() => data.images ?? [], [data.images]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goToPrev = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  }, [lightboxIndex]);

  const goToNext = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  }, [lightboxIndex, images.length]);

  return (
    <section className="pt-28 pb-20 md:pt-32 md:pb-24 min-h-screen bg-sand/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-deep-brown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {data.title || "Our Gallery"}
          </motion.h1>
          {data.description ? (
            <motion.p
              className="text-lg text-(--color-slate)"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {data.description}
            </motion.p>
          ) : null}
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          <AnimatePresence mode="popLayout">
            {images.map((image, index) => (
              <GalleryItem
                key={image._key}
                image={image}
                index={index}
                onClick={() => openLightbox(index)}
              />
            ))}
          </AnimatePresence>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 text-(--color-muted)">
            <p>No images found in the gallery yet.</p>
          </div>
        ) : null}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] ? (
          <Lightbox
            image={images[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={goToPrev}
            onNext={goToNext}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < images.length - 1}
            current={lightboxIndex + 1}
            total={images.length}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function GalleryItem({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const driveUrl = image.imageUrl ? getGoogleDriveImageUrl(image.imageUrl) : null;

  if (!driveUrl) return null;

  return (
    <motion.div
      layout
      className="break-inside-avoid relative group rounded-2xl overflow-hidden mb-4 cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      onClick={onClick}
    >
      <div className="relative w-full bg-amber-50 dark:bg-gray-800">
        {/* Loading Skeleton */}
        {isLoading && !hasError ? (
          <div className="absolute inset-0 flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-2">
              <LoaderIcon className="w-6 h-6 text-gold" />
              <span className="text-xs text-amber-600/60">Loading...</span>
            </div>
          </div>
        ) : null}

        {/* Error State */}
        {hasError ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] bg-amber-50/50 dark:bg-gray-800/50 gap-2">
            <span className="text-sm text-amber-700">Unable to load</span>
          </div>
        ) : null}

        {/* Actual Image */}
        {/* Actual Image */}
        <OptimizedImage
          src={driveUrl}
          alt={image.title || "Gallery image"}
          width={600}
          height={400}
          className={cn(
            "w-full h-auto max-w-full object-contain transform transition-all duration-700",
            "group-hover:scale-105",
            hasError ? "opacity-0 absolute" : "opacity-100"
          )}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          onLoad={() => setIsLoading(false)}
        />

        {/* Gradient Overlay */}
        {!hasError ? (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        ) : null}

        {/* Info on Hover */}
        {!hasError ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-black/60">
            {image.title ? (
              <h3 className="text-white font-medium text-lg leading-tight drop-shadow-md">
                {image.title}
              </h3>
            ) : null}
          </div>
        ) : null}

        {/* Click indicator */}
        {!hasError ? (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 text-deep-brown"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function Lightbox({
  image,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  current,
  total,
}: {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  current: number;
  total: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const driveUrl = image.imageUrl ? getGoogleDriveImageUrl(image.imageUrl) : null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <CloseIcon />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
        {current} / {total}
      </div>

      {/* Previous button */}
      {hasPrev ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 p-3 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <ChevronLeftIcon />
        </button>
      ) : null}

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderIcon className="w-10 h-10 text-gold" />
          </div>
        ) : null}
        {driveUrl ? (
          <OptimizedImage
            src={driveUrl}
            alt={image.title || "Gallery image"}
            width={1200}
            height={800}
            className={cn(
              "max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
          />
        ) : null}

        {/* Title overlay */}
        {image.title && !isLoading ? (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 rounded-b-lg">
            <h3 className="text-white text-xl font-medium">{image.title}</h3>
          </div>
        ) : null}
      </div>

      {/* Next button */}
      {hasNext ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 p-3 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <ChevronRightIcon />
        </button>
      ) : null}
    </motion.div>
  );
}
