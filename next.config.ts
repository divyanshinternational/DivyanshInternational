import type { NextConfig } from "next";

/**
 * Content Security Policy (CSP) Header
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io https://i.ytimg.com https://*.ytimg.com https://*.tile.openstreetmap.org https://drive.google.com https://*.googleusercontent.com;
    font-src 'self' data:;
    connect-src 'self' https://*.sanity.io https://*.supabase.co https://cdnjs.cloudflare.com;
    media-src 'self' https://drive.google.com https://*.googlevideo.com blob:;
    worker-src 'self' blob: https://cdnjs.cloudflare.com;
    frame-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.youtube.com https://youtube.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

/**
 * Security headers applied to all routes
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
] as const;

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  typedRoutes: true,

  experimental: {
    optimizePackageImports: ["@sanity/ui", "@sanity/icons"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.sanity.io" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== "production",
      hmrRefreshes: process.env.NODE_ENV !== "production",
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
} satisfies NextConfig;

export default nextConfig;
