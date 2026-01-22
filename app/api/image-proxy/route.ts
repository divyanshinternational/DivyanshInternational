import { type NextRequest, NextResponse } from "next/server";

/**
 * API Route: /api/image-proxy
 *
 * Proxies Google Drive images using the fastest lh3 CDN endpoint.
 * Usage: /api/image-proxy?id=GOOGLE_DRIVE_FILE_ID
 */

// Cache successful responses for 24 hours
const CACHE_DURATION = 60 * 60 * 24;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("id");

  if (!fileId) {
    return NextResponse.json({ error: "Missing file ID parameter" }, { status: 400 });
  }

  // Validate file ID format
  if (!/^[\w-]+$/.test(fileId)) {
    return NextResponse.json({ error: "Invalid file ID format" }, { status: 400 });
  }

  try {
    const url = `https://lh3.googleusercontent.com/d/${fileId}=w1200`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await response.arrayBuffer();

    // Return the image with aggressive caching
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 7}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[image-proxy] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
