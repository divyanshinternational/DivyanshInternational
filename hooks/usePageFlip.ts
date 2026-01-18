import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UsePageFlipOptionsSchema = z.object({
  totalPages: z.number().int().min(1),
  initialPage: z.number().int().min(0).optional(),
});

// =============================================================================
// HOOK
// =============================================================================

export function usePageFlip(totalPages: number) {
  // Runtime validation for critical inputs
  const validatedTotalPages = Math.max(1, Math.floor(totalPages));

  const router = useRouter();
  const searchParams = useSearchParams();

  const getPageFromUrl = useCallback(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 0;
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  // Sync state with URL on mount and param change
  useEffect(() => {
    const urlPage = getPageFromUrl();
    const validPage = Math.min(Math.max(0, urlPage), validatedTotalPages - 1);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((prev) => {
      if (prev !== validPage) {
        return validPage;
      }
      return prev;
    });
  }, [getPageFromUrl, validatedTotalPages]);

  const updateURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const nextPage = useCallback(() => {
    if (currentPage < validatedTotalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setDirection("forward");
      const newPage = currentPage + 1;

      setCurrentPage(newPage);
      updateURL(newPage);

      setTimeout(() => setIsFlipping(false), 850);
    }
  }, [currentPage, validatedTotalPages, isFlipping, updateURL]);

  const prevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setDirection("backward");
      const newPage = currentPage - 1;

      setCurrentPage(newPage);
      updateURL(newPage);

      setTimeout(() => setIsFlipping(false), 850);
    }
  }, [currentPage, isFlipping, updateURL]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.min(Math.max(0, page), validatedTotalPages - 1);

      if (validPage !== currentPage && !isFlipping) {
        setIsFlipping(true);
        setDirection(page > currentPage ? "forward" : "backward");
        setCurrentPage(validPage);
        updateURL(validPage);
        setTimeout(() => setIsFlipping(false), 850);
      }
    },
    [currentPage, validatedTotalPages, isFlipping, updateURL]
  );

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          nextPage();
        } else if (e.deltaY < 0) {
          prevPage();
        }
      }, 100);
    };

    const catalogueElement = document.getElementById("product-catalogue");
    if (catalogueElement) {
      catalogueElement.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      if (catalogueElement) {
        catalogueElement.removeEventListener("wheel", handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [nextPage, prevPage]);

  return {
    currentPage,
    isFlipping,
    direction,
    nextPage,
    prevPage,
    goToPage,
    totalPages: validatedTotalPages,
  };
}
