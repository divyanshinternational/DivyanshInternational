import type { NextConfig } from "next";

/**
 * Content Security Policy (CSP) Header
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 *
 * NOTE: For production, consider replacing 'unsafe-inline' with nonce-based CSP.
 * This requires middleware to inject nonces into scripts/styles.
 */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io https://images.unsplash.com https://picsum.photos https://i.ytimg.com https://*.ytimg.com https://unpkg.com https://*.tile.openstreetmap.org https://drive.google.com https://*.googleusercontent.com https://www.google.com https://google.com;
    font-src 'self' data:;
    connect-src 'self' https://*.sanity.io https://*.supabase.co https://cdnjs.cloudflare.com;
    media-src 'self' https://cdn.coverr.co https://*.coverr.co https://drive.google.com https://*.googlevideo.com blob:;
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
 * @see https://nextjs.org/docs/app/api-reference/next-config-js/headers
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Prevents clickjacking attacks
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevents MIME-sniffing attacks
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Permissions-Policy for browser features (only standardized features)
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Cross-Origin-Opener-Policy for popup isolation
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    // Cross-Origin-Resource-Policy for resource isolation
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
] as const;

const nextConfig = {
  // Core Settings
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Type-safe routing for Link components (promoted from experimental in Next.js 16)
  typedRoutes: true,

  // Experimental Features
  experimental: {
    // Optimized package imports
    optimizePackageImports: ["lucide-react", "@sanity/ui", "@sanity/icons"],
  },

  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  // Styled Components SSR Support
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: process.env.NODE_ENV !== "production",
      fileName: false,
    },
  },

  // Development Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== "production",
      hmrRefreshes: process.env.NODE_ENV !== "production",
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders],
      },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
