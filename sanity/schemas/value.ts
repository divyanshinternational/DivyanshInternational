import { defineType, defineField } from "sanity";

export default defineType({
  name: "value",
  title: "Company Value",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
      description: "Name of the value (e.g., 'Quality First').",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: "Explain what this value means for the company.",
    }),
    defineField({
      name: "icon",
      title: "Icon / Emoji",
      type: "string",
      validation: (Rule) => Rule.max(10),
      description: "Emoji or icon name (e.g., ⭐ or 'star').",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (Rule) => Rule.integer(),
      initialValue: 0,
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
      subtitle: "description",
      icon: "icon",
      order: "order",
    },
    prepare({ title, subtitle, icon, order }) {
      return {
        title: `${icon || "📌"} ${title || "Untitled Value"}`,
        subtitle: `#${order ?? "?"} – ${subtitle || "No description"}`,
      };
    },
  },
});
