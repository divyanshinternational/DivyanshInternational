"use client";

import { ReactLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import type { ReactNode } from "react";

interface SmoothScrollingProps {
  children: ReactNode;
}

const SCROLL_OPTIONS: LenisOptions = {
  lerp: 0.1,
  duration: 1.5,
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: 2,
};

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  return (
    <ReactLenis root options={SCROLL_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
