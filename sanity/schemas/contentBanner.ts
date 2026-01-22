import { defineType, defineField } from "sanity";

export default defineType({
  name: "contentBanner",
  title: "Content Banner",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "title",
      title: "Main Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlight",
      title: "Highlight Text",
      type: "string",
      description: "Emphasized text (often larger or different color)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "features",
      title: "Feature Points",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points or key features",
    }),
    defineField({
      name: "layout",
      title: "Layout Style",
      type: "string",
      options: {
        list: [
          { title: "Image Bottom (Hero Style)", value: "bottom-image" },
          { title: "Image Right (Split)", value: "right-image" },
          { title: "Image Left (Split)", value: "left-image" },
          { title: "Background Image (Overlay)", value: "background-image" },
          { title: "Text Only", value: "text-only" },
        ],
        layout: "radio",
      },
      initialValue: "bottom-image",
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL (Google Drive)",
      type: "url",
      description: "Google Drive or direct URL for the image",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "image",
      title: "Sanity Image Asset",
      type: "image",
      description: "Direct upload to Sanity (alternative to URL)",
      options: { hotspot: true },
    }),
    defineField({
      name: "bgOverlay",
      title: "Background Overlay",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Dark (10%)", value: "black-10" },
          { title: "Dark (20%)", value: "black-20" },
          { title: "Dark (40%)", value: "black-40" },
          { title: "Light (10%)", value: "white-10" },
        ],
      },
      hidden: ({ parent }) => parent?.layout !== "background-image",
      initialValue: "black-20",
    }),
    defineField({
      name: "theme",
      title: "Color Theme",
      type: "string",
      options: {
        list: [
          { title: "Light (White/Beige)", value: "light" },
          { title: "Dark (Brown/Black)", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "light",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "layout",
      media: "imageUrl",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Content Banner",
        subtitle: `Layout: ${subtitle}`,
      };
    },
  },
});
