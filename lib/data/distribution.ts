import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

export const DistributionRegionSchema = z.object({
  _id: z.string().optional(),
  _type: z.literal("distributionRegion").optional(),
  name: z.string(),
  description: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  radius: z.number().optional().default(50000),
});

export const DistributionMapConfigSchema = z.object({
  heading: z.string().optional(),
  regions: z.array(DistributionRegionSchema).optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type DistributionRegion = z.infer<typeof DistributionRegionSchema>;
export type DistributionMapConfig = z.infer<typeof DistributionMapConfigSchema>;

// =============================================================================
// DEFAULT DATA (Fallback)
// =============================================================================

export const DEFAULT_DISTRIBUTION_REGIONS: DistributionRegion[] = [
  { name: "Delhi NCR", lat: 28.6139, lng: 77.209, radius: 40000 },
  { name: "Punjab", lat: 31.1471, lng: 75.3412, radius: 70000 },
  { name: "Haryana", lat: 29.0588, lng: 76.0856, radius: 60000 },
];
