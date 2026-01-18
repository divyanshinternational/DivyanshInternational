import { defineType, defineField } from "sanity";

export default defineType({
  name: "sustainabilityPillar",
  title: "Sustainability Pillar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
      description: "Name of the sustainability initiative or pillar.",
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: "Brief description of the initiative (approx. 2-3 sentences).",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (Rule) => Rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "detail",
      order: "order",
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order ? `#${order}. ` : ""}${title || "Untitled"}`,
        subtitle: subtitle,
      };
    },
  },
});
