import { defineType, defineField } from "sanity";

export default defineType({
  name: "processStep",
  title: "Process Step",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Step Title",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "icon",
      title: "Icon Type",
      type: "string",
      description: "Icon identifier for this step",
      options: {
        list: [
          { title: "Farm", value: "farm" },
          { title: "Shelling", value: "shelling" },
          { title: "Sorting", value: "sorting" },
          { title: "Quality", value: "quality" },
          { title: "Packing", value: "packing" },
          { title: "Shipping", value: "shipping" },
        ],
      },
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
      title: "Step Order",
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
        title: `${order ? `#${order}. ` : ""}${title}`,
        subtitle: subtitle,
      };
    },
  },
});
