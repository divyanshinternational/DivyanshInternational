import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";

const SanityImageSourceSchema = z.custom<SanityImageSource>((val) => val !== undefined);

export const VideoItemSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnail: SanityImageSourceSchema.optional(),
});

export const VideoShowcaseSchema = z.object({
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  placeholderText: z.string().nullish(),
  highlights: z.array(z.string()).nullish(),
  note: z.string().nullish(),
  videoUrl: z.string().nullish(),
  image: SanityImageSourceSchema.nullish(),
  videos: z.array(VideoItemSchema).nullish(),
});
