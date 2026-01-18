"use client";

/**
 * Sanity Studio Page
 * Renders the embedded Sanity CMS studio interface
 * Must be a client component as NextStudio uses client-side features
 */

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
