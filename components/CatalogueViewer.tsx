"use client";

/**
 * Catalogue Viewer Component
 *
 * A professional catalogue viewer with page-flip animation for images.
 * For PDFs, embeds them directly or provides download option.
 */

import React, { useState, useRef, useCallback, useEffect, forwardRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Dynamic import to avoid SSR issues with react-pageflip
const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-almond-gold" />
    </div>
  ),
});

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const PageAssetSchema = z.object({
  _id: z.string(),
  url: z.string(),
});

const PageSchema = z.object({
  _key: z.string(),
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  asset: PageAssetSchema.optional().nullable(),
});

const PdfAssetSchema = z.object({
  _id: z.string(),
  url: z.string().optional().nullable(),
  originalFilename: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
});

const CatalogueSettingsSchema = z.object({
  _id: z.string().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  contentType: z.enum(["pdf", "images"]).optional().nullable(),
  pdfFile: z.object({ asset: PdfAssetSchema.optional().nullable() }).optional().nullable(),
  pages: z.array(PageSchema).optional().nullable(),
  pdfDownloadUrl: z.string().optional().nullable(),
  coverImage: z.object({ asset: PageAssetSchema.optional().nullable() }).optional().nullable(),
  version: z.string().optional().nullable(),
  lastUpdated: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  showThumbnails: z.boolean().optional().nullable(),
  showPageNumbers: z.boolean().optional().nullable(),
});

const CatalogueViewerPropsSchema = z.object({
  settings: CatalogueSettingsSchema.nullable().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type CatalogueSettings = z.infer<typeof CatalogueSettingsSchema>;
export type CatalogueViewerProps = z.infer<typeof CatalogueViewerPropsSchema>;

type Page = z.infer<typeof PageSchema>;

// =============================================================================
// PAGE COMPONENT (for react-pageflip)
// =============================================================================

interface PageComponentProps {
  page: Page;
  pageNumber: number;
  showPageNumbers: boolean;
}

const PageComponent = forwardRef<HTMLDivElement, PageComponentProps>(
  ({ page, pageNumber, showPageNumbers }, ref) => {
    const imageUrl = page.asset?.url;

    return (
      <div
        ref={ref}
        className="page-wrapper"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.03)",
        }}
      >
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={page.alt || `Page ${pageNumber}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={pageNumber <= 2}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-400 h-full">
            <span className="text-xl">Page {pageNumber}</span>
          </div>
        )}

        {showPageNumbers ? (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-600 bg-white/90 px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
            {pageNumber}
          </div>
        ) : null}
      </div>
    );
  }
);
PageComponent.displayName = "PageComponent";

// =============================================================================
// PDF VIEWER COMPONENT
// =============================================================================

function PDFViewer({
  url,
  title,
  onDownload,
}: {
  url: string;
  title: string;
  onDownload: () => void;
}) {
  return (
    <div className="w-full">
      {/* PDF Embed */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <iframe
          src={`${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
          className="w-full h-[70vh] min-h-[500px]"
          title={title}
          style={{ border: "none" }}
        />
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onDownload}
          className="px-8 py-4 bg-linear-to-r from-almond-gold to-gold-dark text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 text-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CatalogueViewer({ settings }: CatalogueViewerProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    const result = CatalogueViewerPropsSchema.safeParse({ settings });
    if (!result.success) {
      console.warn("[CatalogueViewer] Prop validation warning:", result.error.flatten());
    }
  }

  const flipBookRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 550 });

  const imagePages = settings?.pages ?? [];
  const contentType = settings?.contentType ?? "images";
  const isActive = settings?.isActive !== false;
  const showThumbnails = settings?.showThumbnails !== false;
  const showPageNumbers = settings?.showPageNumbers !== false;
  const displayTitle = settings?.title || "Product Catalogue";
  const displayDescription = settings?.description || "Explore our premium collection.";
  const pdfUrl = settings?.pdfFile?.asset?.url || settings?.pdfDownloadUrl;

  // Filter pages with valid URLs
  const validPages = imagePages.filter((page) => page.asset?.url);

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        const width = Math.min(window.innerWidth - 48, 320);
        setDimensions({ width, height: Math.round(width * 1.4) });
      } else if (window.innerWidth < 1024) {
        setDimensions({ width: 350, height: 490 });
      } else {
        setDimensions({ width: 420, height: 580 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const flipBook = flipBookRef.current as {
        pageFlip?: () => { flipNext: () => void; flipPrev: () => void };
      } | null;
      if (e.key === "ArrowRight") {
        flipBook?.pageFlip?.()?.flipNext();
      } else if (e.key === "ArrowLeft") {
        flipBook?.pageFlip?.()?.flipPrev();
      } else if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const goToPage = useCallback((pageIndex: number) => {
    const flipBook = flipBookRef.current as {
      pageFlip?: () => { turnToPage: (page: number) => void };
    } | null;
    flipBook?.pageFlip?.()?.turnToPage(pageIndex);
  }, []);

  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = settings?.pdfFile?.asset?.originalFilename || "catalogue.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, settings?.pdfFile?.asset?.originalFilename]);

  const flipPrev = useCallback(() => {
    const flipBook = flipBookRef.current as { pageFlip?: () => { flipPrev: () => void } } | null;
    flipBook?.pageFlip?.()?.flipPrev();
  }, []);

  const flipNext = useCallback(() => {
    const flipBook = flipBookRef.current as { pageFlip?: () => { flipNext: () => void } } | null;
    flipBook?.pageFlip?.()?.flipNext();
  }, []);

  // Check if we have content
  const hasImageContent = validPages.length >= 2;
  const hasPdfContent = !!pdfUrl;
  const totalPages = validPages.length;

  // Inactive state
  if (!isActive) {
    return (
      <div className="min-h-screen bg-linear-to-b from-ivory to-beige pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-8">📚</div>
            <h1 className="text-4xl font-bold text-deep-brown mb-4">Catalogue Unavailable</h1>
            <p className="text-lg text-text-light">
              The catalogue is currently disabled. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No content state
  if (!hasImageContent && !hasPdfContent) {
    return (
      <div className="min-h-screen bg-linear-to-b from-ivory to-beige pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-8">📖</div>
            <h1 className="text-4xl font-bold text-deep-brown mb-4">No Catalogue Content</h1>
            <p className="text-lg text-text-light">
              Please add catalogue pages or a PDF in the CMS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PDF Content Type - Show embedded PDF viewer
  if (contentType === "pdf" && hasPdfContent) {
    return (
      <div className="min-h-screen bg-linear-to-b from-ivory to-beige pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-4 font-heading">
              {displayTitle}
            </h1>
            <p className="text-lg text-text-light max-w-2xl mx-auto">{displayDescription}</p>
          </motion.div>

          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <PDFViewer url={pdfUrl} title={displayTitle} onDownload={handleDownload} />
          </motion.div>
        </div>
      </div>
    );
  }

  // Image Flipbook
  return (
    <div className="min-h-screen bg-linear-to-b from-ivory to-beige pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-4 font-heading">
            {displayTitle}
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">{displayDescription}</p>
        </motion.div>

        {/* Flipbook Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "relative mx-auto",
            isFullscreen && "fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          )}
          style={
            !isFullscreen
              ? { maxWidth: isMobile ? dimensions.width + 80 : dimensions.width * 2 + 120 }
              : {}
          }
        >
          {/* Loading State */}
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-ivory to-cashew-cream z-20 rounded-2xl"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-almond-gold border-t-transparent mx-auto mb-4" />
                  <p className="text-text-light text-lg">Loading catalogue...</p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>
            {pdfUrl ? (
              <button
                onClick={handleDownload}
                className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200"
                aria-label="Download PDF"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            ) : null}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={flipPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/95 hover:bg-white rounded-full shadow-xl transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-100"
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={flipNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/95 hover:bg-white rounded-full shadow-xl transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-100"
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Flipbook */}
          <div className="p-8 md:p-10 flex justify-center bg-linear-to-b from-gray-50 to-gray-100 rounded-2xl shadow-xl">
            {validPages.length > 0 ? (
              <HTMLFlipBook
                ref={flipBookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="fixed"
                minWidth={280}
                maxWidth={500}
                minHeight={400}
                maxHeight={700}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handleFlip}
                onInit={() => setIsLoading(false)}
                className="catalogue-flipbook"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={600}
                usePortrait={isMobile}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.5}
                showPageCorners={true}
                disableFlipByClick={false}
                swipeDistance={30}
                clickEventForward={true}
                useMouseEvents={true}
              >
                {validPages.map((page, index) => (
                  <PageComponent
                    key={page._key || `page-${index}`}
                    page={page}
                    pageNumber={index + 1}
                    showPageNumbers={showPageNumbers}
                  />
                ))}
              </HTMLFlipBook>
            ) : null}
          </div>

          {/* Page Counter */}
          <div className="text-center py-5">
            <span className="text-base font-medium text-deep-brown bg-white px-6 py-2.5 rounded-full shadow-md border border-gray-200">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
        </motion.div>

        {/* Thumbnails */}
        {showThumbnails && validPages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <div className="flex gap-3 overflow-x-auto pb-4 px-4 justify-center flex-wrap">
              {validPages.slice(0, 16).map((page, index) => (
                <button
                  key={page._key || `thumb-${index}`}
                  onClick={() => goToPage(index)}
                  className={cn(
                    "relative w-16 h-22 md:w-20 md:h-28 rounded-lg overflow-hidden border-2 transition-all shrink-0 hover:scale-105 bg-white shadow-md",
                    currentPage === index
                      ? "border-almond-gold shadow-lg ring-2 ring-almond-gold/30"
                      : "border-gray-200 hover:border-gold-light"
                  )}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {page.asset?.url ? (
                    <Image
                      src={page.asset.url}
                      alt={page.alt || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : null}
                  {currentPage === index ? (
                    <div className="absolute inset-0 bg-almond-gold/20" />
                  ) : null}
                </button>
              ))}
              {validPages.length > 16 ? (
                <div className="flex items-center text-sm text-gray-500 px-2">
                  +{validPages.length - 16} more
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {/* Touch Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center md:hidden"
        >
          <p className="text-sm text-text-muted">👆 Swipe or tap to flip pages</p>
        </motion.div>

        {/* Download Button */}
        {pdfUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-linear-to-r from-almond-gold to-gold-dark text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF Catalogue
            </button>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
