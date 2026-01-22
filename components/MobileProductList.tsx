"use client";

import { z } from "zod";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized, type LocaleString, type LocaleText } from "@/lib/i18n";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ProductSchema = z.object({
  _id: z.string(),
  title: z.custom<LocaleString>(),
  category: z.string(),
  description: z.custom<LocaleText>().optional(),
  heroImage: z.custom<SanityImageSource>().optional(),
  MOQ: z.string().optional(),
  packFormats: z.array(z.string()).optional(),
  grades: z.array(z.string()).optional(),
});

const LabelsSchema = z.object({
  selectLabel: z.string().optional(),
  varietyLabel: z.string().optional(),
  packagingLabel: z.string().optional(),
  quantityLabel: z.string().optional(),
});

const MobileProductListPropsSchema = z.object({
  products: z.array(ProductSchema),
  selectedProducts: z.custom<Set<string>>((val) => val instanceof Set),
  toggleProductSelection: z.function(),
  labels: LabelsSchema.optional(),
});

type Product = z.infer<typeof ProductSchema>;

interface MobileProductListProps {
  products: Product[];
  selectedProducts: Set<string>;
  toggleProductSelection: (id: string) => void;
  labels?: z.infer<typeof LabelsSchema>;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function MobileProductList({
  products,
  selectedProducts,
  toggleProductSelection,
  labels = {},
}: MobileProductListProps) {
  // Runtime validation in development
  if (process.env.NODE_ENV === "development") {
    const result = MobileProductListPropsSchema.safeParse({
      products,
      selectedProducts,
      toggleProductSelection,
      labels,
    });
    if (!result.success) {
      console.warn("[MobileProductList] Prop validation warning:", result.error.flatten());
    }
  }

  const { language } = useLanguage();

  // Default Labels
  const selectLabel = labels?.selectLabel || "Select";
  const varietyLabel = labels?.varietyLabel || "Variety:";
  const packagingLabel = labels?.packagingLabel || "Packaging:";
  const quantityLabel = labels?.quantityLabel || "Quantity:";

  return (
    <div className="space-y-6 pb-32">
      {products.map((product) => {
        const productTitle = getLocalized(product.title, language);
        const productDescription = getLocalized(product.description, language);
        const isSelected = selectedProducts.has(product._id);

        return (
          <div
            key={product._id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${
              isSelected ? "border-gold ring-1 ring-gold" : "border-sand"
            }`}
          >
            {/* Image & Selection Toggle */}
            <div className="relative aspect-video w-full bg-sand">
              {product.heroImage ? (
                <OptimizedImage
                  src={urlForImage(product.heroImage).width(600).height(400).url()}
                  alt={productTitle}
                  fill
                  className="object-scale-down"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={100}
                />
              ) : null}

              <div className="absolute top-4 right-4 z-10">
                <label
                  className={`flex items-center gap-2 cursor-pointer backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm transition-colors ${
                    isSelected ? "bg-gold/90 text-white" : "bg-white/90 text-deep-brown"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProductSelection(product._id)}
                    className="w-4 h-4 rounded border-2 border-current text-gold focus:ring-2 focus:ring-offset-2 focus:ring-gold cursor-pointer accent-gold"
                    aria-label={`${selectLabel} ${productTitle}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wide">{selectLabel}</span>
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-gold-dark font-bold mb-1">
                  {product.category}
                </p>
                <h3 className="text-xl font-bold text-deep-brown font-heading leading-tight">
                  {productTitle}
                </h3>
              </div>

              {productDescription ? (
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                  {productDescription}
                </p>
              ) : null}

              {/* Product Details Grid */}
              <div className="pt-3 mt-1 border-t border-sand/50 grid grid-cols-1 gap-2 text-sm">
                {/* Variety/Grades */}
                {product.grades && product.grades.length > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider min-w-[80px]">
                      {varietyLabel}
                    </span>
                    <span className="text-deep-brown font-medium truncate">
                      {product.grades.join(", ")}
                    </span>
                  </div>
                ) : null}

                {/* Packaging */}
                {product.packFormats && product.packFormats.length > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider min-w-[80px]">
                      {packagingLabel}
                    </span>
                    <span className="text-deep-brown font-medium truncate">
                      {product.packFormats.join(", ")}
                    </span>
                  </div>
                ) : null}

                {/* MOQ */}
                {product.MOQ ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider min-w-[80px]">
                      {quantityLabel}
                    </span>
                    <span className="text-deep-brown font-medium">{product.MOQ}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
