import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "core", title: "Core Info" },
    { name: "content", title: "Page Content" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO & Metadata" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // =========================================================================
    // CORE INFO
    // =========================================================================
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "core",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "core",
      options: {
        list: [
          { title: "Almonds", value: "almonds" },
          { title: "Cashews", value: "cashews" },
          { title: "Walnuts", value: "walnuts" },
          { title: "Raisins", value: "raisins" },
          { title: "Pistachio", value: "pistachio" },
          { title: "Cardamom", value: "cardamom" },
          { title: "Coconut", value: "coconut" },
          { title: "Dried Fig", value: "dried-fig" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "localeText",
      group: "core",
      description: "Brief summary for cards and standard listings",
    }),

    // =========================================================================
    // PAGE CONTENT
    // =========================================================================
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "localeString",
      group: "content",
      description: "Impactful heading for the product detail page hero section",
    }),
    defineField({
      name: "introParagraphs",
      title: "Introduction Paragraphs",
      type: "array",
      group: "content",
      of: [{ type: "localeText" }],
    }),
    defineField({
      name: "listSections",
      title: "Feature Lists (Varieties, Grades, etc.)",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          title: "Section",
          fields: [
            defineField({
              name: "title",
              title: "Section Title",
              type: "localeString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "items",
              title: "List Items",
              type: "array",
              of: [{ type: "localeString" }],
            }),
          ],
          preview: {
            select: {
              title: "title.en",
              item0: "items.0.en",
              item1: "items.1.en",
            },
            prepare({ title, item0, item1 }) {
              const subtitle = [item0, item1].filter(Boolean).join(", ");
              return {
                title: title || "Untitled Section",
                subtitle: subtitle ? `${subtitle}...` : "No items",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "ctaLine",
      title: "CTA Line",
      type: "localeString",
      group: "content",
      description: "Persuasive text near the call-to-action button",
    }),

    // =========================================================================
    // MEDIA
    // =========================================================================
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Image Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "microVideo",
      title: "Micro Video",
      type: "file",
      group: "media",
      options: { accept: "video/*" },
      description: "Short, looping video for visual impact",
    }),
    defineField({
      name: "specSheetPDF",
      title: "Spec Sheet PDF",
      type: "file",
      group: "media",
      options: { accept: "application/pdf" },
      description: "Downloadable technical specifications",
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
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title.en", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "category",
      media: "heroImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Product",
        subtitle: subtitle ? `Category: ${subtitle}` : "Uncategorized",
        media,
      };
    },
  },
});
