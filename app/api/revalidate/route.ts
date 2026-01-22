import { revalidateTag, revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// =============================================================================
// SANITY WEBHOOK REVALIDATION
// =============================================================================

// Document type to cache tag mapping
const DOCUMENT_TYPE_TAGS: Record<string, string[]> = {
  // Global settings
  siteSettings: ["siteSettings", "global"],
  header: ["header", "global"],
  footer: ["footer", "global"],

  // Home page
  homePage: ["homePage", "home"],
  heroSlide: ["heroSlides", "home"],
  capability: ["capabilities", "home"],
  processStep: ["processSteps", "home"],
  sustainabilityPillar: ["sustainability", "home"],
  certificate: ["certificates", "home"],
  testimonial: ["testimonials", "home"],
  testimonialsSection: ["testimonialsSection", "home"],
  cta: ["cta", "global"],
  quote: ["quote", "global"],

  // Products
  product: ["products", "product"],
  productsPage: ["productsPage", "products"],
  brand: ["brands", "products"],
  catalogueSettings: ["catalogue", "products"],

  // About & Community
  about: ["about"],
  teamMember: ["team", "about"],
  timeline: ["timeline", "about"],
  value: ["values", "about"],
  community: ["community"],
  distributionRegion: ["distribution"],

  // Contact & Legal
  contactPage: ["contact"],
  privacyPolicy: ["privacy"],
  galleryPage: ["gallery"],
};

// Paths to revalidate for each document type
const DOCUMENT_TYPE_PATHS: Record<string, string[]> = {
  siteSettings: ["/"],
  header: ["/"],
  footer: ["/"],
  homePage: ["/"],
  heroSlide: ["/"],
  capability: ["/"],
  processStep: ["/"],
  sustainabilityPillar: ["/"],
  certificate: ["/"],
  testimonial: ["/"],
  testimonialsSection: ["/"],
  cta: ["/"],
  quote: ["/"],
  product: ["/", "/products"],
  productsPage: ["/products"],
  brand: ["/products"],
  catalogueSettings: ["/products"],
  about: ["/about"],
  teamMember: ["/about"],
  timeline: ["/about"],
  value: ["/about"],
  community: ["/community"],
  distributionRegion: ["/about"],
  contactPage: ["/contact"],
  privacyPolicy: ["/privacy-policy"],
  galleryPage: ["/gallery"],
};

export async function POST(req: NextRequest) {
  try {
    // Validate the webhook secret
    const secret = process.env["SANITY_WEBHOOK_SECRET"];

    if (!secret) {
      console.error("[Revalidate] Missing SANITY_WEBHOOK_SECRET");
      return NextResponse.json({ message: "Webhook secret not configured" }, { status: 500 });
    }

    // Parse and validate the webhook body
    const { isValidSignature, body } = await parseBody<{
      _type: string;
      _id: string;
      slug?: { current: string };
    }>(req, secret);

    if (!isValidSignature) {
      console.warn("[Revalidate] Invalid webhook signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      console.warn("[Revalidate] Missing document type in webhook body");
      return NextResponse.json({ message: "Missing document type" }, { status: 400 });
    }

    const { _type, _id, slug } = body;
    const revalidatedTags: string[] = [];
    const revalidatedPaths: string[] = [];

    // Revalidate tags for this document type
    const tags = DOCUMENT_TYPE_TAGS[_type] || [];
    for (const tag of tags) {
      revalidateTag(tag, "default");
      revalidatedTags.push(tag);
    }

    // Revalidate paths for this document type
    const paths = DOCUMENT_TYPE_PATHS[_type] || [];
    for (const path of paths) {
      revalidatePath(path, "page");
      revalidatedPaths.push(path);
    }

    // For products with slugs, also revalidate the specific product page
    if (_type === "product" && slug?.current) {
      const productPath = `/products/${slug.current}`;
      revalidatePath(productPath, "page");
      revalidatedPaths.push(productPath);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      documentType: _type,
      documentId: _id,
      tags: revalidatedTags,
      paths: revalidatedPaths,
    });
  } catch (error) {
    console.error("[Revalidate] Error processing webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook", error: String(error) },
      { status: 500 }
    );
  }
}
