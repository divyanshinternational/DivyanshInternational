import { defineType, defineField } from "sanity";

export default defineType({
  name: "capability",
  title: "Capability",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(300),
    }),
    defineField({
      name: "metric",
      title: "Metric Badge",
      description: "Short highlight text (e.g., '12+ origins', 'ISO 22000')",
      type: "string",
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      description: "Lucide icon name (optional)",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "metric",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Metric: ${subtitle}` : "No metric",
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
