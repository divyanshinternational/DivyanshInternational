import { defineType, defineField } from "sanity";

export default defineType({
  name: "timeline",
  title: "Timeline Entry",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1900).max(2100),
      description: "Year of the milestone (e.g., 1998).",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
      description: "Short title for the milestone.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(500),
      description: "Details about what happened in this year.",
    }),
    defineField({
      name: "image",
      title: "Timeline Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Accessibility description of the image.",
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Year (Newest First)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Year (Oldest First)",
      name: "yearAsc",
      by: [{ field: "year", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      media: "image",
    },
    prepare({ title, year, media }) {
      return {
        title: `${year || "????"} – ${title || "Untitled"}`,
        subtitle: `Year: ${year}`,
        media,
      };
    },
  },
});
