import React from "react";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

const VisualVariantsSchema = z.enum(["default", "hero", "section", "footer"]);
const DensitySchema = z.enum(["light", "medium", "heavy"]);
const ProductTypeSchema = z.enum(["coconut", "nuts", "almonds", "general"]);
const SizeSchema = z.enum(["sm", "md", "lg"]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VisualElementsPropsSchema = z.object({
  variant: VisualVariantsSchema.optional().default("default"),
  density: DensitySchema.optional().default("medium"),
  className: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductVisualPropsSchema = z.object({
  productType: ProductTypeSchema,
  size: SizeSchema.optional().default("md"),
  className: z.string().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

type VisualVariants = z.infer<typeof VisualVariantsSchema>;
type VisualElementsProps = z.infer<typeof VisualElementsPropsSchema>;
type ProductVisualProps = z.infer<typeof ProductVisualPropsSchema>;

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE_ELEMENTS = [
  {
    type: "almond",
    size: "w-8 h-6",
    color: "bg-amber-300",
    rotation: "rotate-12",
    opacity: "opacity-20",
  },
  {
    type: "almond",
    size: "w-6 h-4",
    color: "bg-orange-300",
    rotation: "-rotate-12",
    opacity: "opacity-15",
  },
  {
    type: "cashew",
    size: "w-10 h-8",
    color: "bg-amber-400",
    rotation: "rotate-45",
    opacity: "opacity-10",
  },
  {
    type: "cashew",
    size: "w-6 h-6",
    color: "bg-orange-400",
    rotation: "",
    opacity: "opacity-15",
  },
  {
    type: "pistachio",
    size: "w-8 h-6",
    color: "bg-amber-300",
    rotation: "rotate-45",
    opacity: "opacity-10",
  },
  {
    type: "pistachio",
    size: "w-6 h-4",
    color: "bg-orange-300",
    rotation: "-rotate-30",
    opacity: "opacity-15",
  },
  {
    type: "small",
    size: "w-4 h-4",
    color: "bg-amber-200",
    rotation: "",
    opacity: "opacity-10",
  },
  {
    type: "small",
    size: "w-5 h-3",
    color: "bg-orange-200",
    rotation: "rotate-60",
    opacity: "opacity-10",
  },
];

const POSITIONS: Record<VisualVariants, string[]> = {
  hero: [
    "top-20 right-10",
    "top-32 right-20",
    "top-1/4 left-8",
    "top-1/3 left-16",
    "bottom-1/4 right-1/4",
    "bottom-1/3 left-1/3",
    "top-2/3 right-1/3",
    "top-1/2 left-1/4",
  ],
  section: [
    "top-8 right-8",
    "bottom-8 left-8",
    "top-4 right-4",
    "bottom-4 left-4",
    "top-12 left-12",
    "bottom-12 right-12",
    "top-6 left-1/3",
    "bottom-6 right-1/3",
  ],
  footer: [
    "top-4 left-8",
    "top-8 right-12",
    "top-12 left-1/4",
    "top-6 right-1/4",
    "top-16 left-16",
    "top-20 right-20",
    "top-10 left-1/2",
    "top-14 right-1/3",
  ],
  default: [
    "top-10 right-10",
    "top-20 left-10",
    "bottom-10 right-10",
    "bottom-20 left-10",
    "top-1/3 right-1/4",
    "bottom-1/3 left-1/4",
    "top-2/3 left-1/3",
    "bottom-2/3 right-1/3",
  ],
};

const SIZE_CLASSES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

// =============================================================================
// COMPONENTS
// =============================================================================

export default function VisualElements({
  variant = "default",
  density = "medium",
  className = "",
}: VisualElementsProps) {
  const getElements = () => {
    if (density === "light") {
      return BASE_ELEMENTS.slice(0, 4);
    } else if (density === "heavy") {
      return [...BASE_ELEMENTS, ...BASE_ELEMENTS.slice(0, 4)];
    }
    return BASE_ELEMENTS;
  };

  const elements = getElements();
  const positions = POSITIONS[variant] || POSITIONS.default;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${positions[index % positions.length]} ${element.size} ${element.color} rounded-full transform ${element.rotation} ${element.opacity}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function HeroVisualElements({ className }: { className?: string }) {
  return <VisualElements variant="hero" density="medium" className={className ?? ""} />;
}

export function SectionVisualElements({ className }: { className?: string }) {
  return <VisualElements variant="section" density="light" className={className ?? ""} />;
}

export function FooterVisualElements({ className }: { className?: string }) {
  return <VisualElements variant="footer" density="light" className={className ?? ""} />;
}

export function ProductVisual({ productType, size = "md", className = "" }: ProductVisualProps) {
  const baseSize = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  switch (productType) {
    case "coconut":
      return (
        <div
          className={`${baseSize} bg-white rounded-lg flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <div className="w-3/4 h-3/4 bg-amber-300 rounded-sm"></div>
        </div>
      );
    case "almonds":
      return (
        <div
          className={`${baseSize} bg-amber-400 rounded-full transform rotate-12 flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <div className="w-3/4 h-1/2 bg-amber-200 rounded-full"></div>
        </div>
      );
    case "nuts":
      return (
        <div
          className={`${baseSize} bg-amber-400 rounded-full transform rotate-12 ${className}`}
          aria-hidden="true"
        ></div>
      );
    default:
      return (
        <div
          className={`${baseSize} bg-amber-300 rounded-full ${className}`}
          aria-hidden="true"
        ></div>
      );
  }
}
