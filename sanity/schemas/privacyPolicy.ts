import { defineType, defineField } from "sanity";

export default defineType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content Sections",
      type: "array",
      of: [
        {
          type: "object",
          title: "Section",
          fields: [
            {
              name: "heading",
              title: "Section Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "body",
              title: "Section Body",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "lastUpdated",
    },
    prepare({ title, date }) {
      return {
        title: title || "Privacy Policy",
        subtitle: date ? `Last Updated: ${date}` : "No date set",
      };
    },
  },
});
