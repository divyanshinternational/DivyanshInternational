import { defineType, defineField } from "sanity";

export default defineType({
  name: "quote",
  title: "Spiral Quote",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote Text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(300),
      description: "Primary quote text displayed in the spiral section.",
    }),
    defineField({
      name: "author",
      title: "Author / Attribution",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Name of the person or entity being quoted.",
    }),
    defineField({
      name: "linkText",
      title: "Link Label",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Text for the call-to-action button (e.g., 'Discover Our Story').",
    }),
    defineField({
      name: "linkUrl",
      title: "Link URL",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Destination URL (can be relative link e.g., '/about').",
    }),
  ],
  preview: {
    select: {
      title: "quote",
      subtitle: "author",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Spiral Quote",
        subtitle: subtitle ? `By ${subtitle}` : "No author",
      };
    },
  },
});
