import { defineType, defineField } from "sanity";

export default defineType({
  name: "productsPage",
  title: "Products Page",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Products Page",
        subtitle: subtitle,
      };
    },
  },
});
