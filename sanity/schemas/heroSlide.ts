import { defineType, defineField } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "media", title: "Media" },
    { name: "cta", title: "Calls to Action" },
    { name: "stats", title: "Statistics" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // =========================================================================
    // CONTENT
    // =========================================================================
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: "badge",
      title: "Badge Text",
      type: "string",
      group: "content",
      description: "Small badge displayed above the headline (e.g., ISO Certified)",
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      group: "content",
      of: [{ type: "text", rows: 3 }],
      validation: (Rule) => Rule.max(3),
    }),

    // =========================================================================
    // MEDIA
    // =========================================================================
    defineField({
      name: "video",
      title: "Video File",
      type: "file",
      group: "media",
      description: "Upload video file directly (recommended for performance)",
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (fallback)",
      type: "url",
      group: "media",
      description: "External video URL (used if no video file is uploaded)",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "posterImage",
      title: "Poster Image",
      type: "image",
      group: "media",
      description: "Thumbnail shown before video loads (Critical for LCP)",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for accessibility and SEO",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // =========================================================================
    // CALLS TO ACTION
    // =========================================================================
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      group: "cta",
      fields: [
        {
          name: "label",
          type: "string",
          title: "Label",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "target",
          type: "string",
          title: "Target ID",
          description: "e.g., #products or /contact",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "object",
      group: "cta",
      fields: [
        {
          name: "label",
          type: "string",
          title: "Label",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "target",
          type: "string",
          title: "Target ID",
          description: "e.g., #products or /contact",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // =========================================================================
    // STATISTICS
    // =========================================================================
    defineField({
      name: "stats",
      title: "Hero Stats",
      type: "array",
      group: "stats",
      of: [
        {
          type: "object",
          title: "Stat",
          fields: [
            { name: "value", type: "string", title: "Value", description: "e.g., 25+" },
            { name: "label", type: "string", title: "Label", description: "e.g., Years" },
            { name: "detail", type: "string", title: "Detail", description: "e.g., of Excellence" },
          ],
        },
      ],
    }),

    // =========================================================================
    // SETTINGS
    // =========================================================================
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      group: "settings",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order Ascending",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "headline",
      subtitle: "eyebrow",
      media: "posterImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Hero Slide",
        subtitle: subtitle || "No eyebrow text",
        media,
      };
    },
  },
});
