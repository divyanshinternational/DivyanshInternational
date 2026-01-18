import { defineType, defineField } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "quickLinks",
      title: "Quick Links",
      description: "Navigation links displayed in the footer",
      type: "array",
      of: [
        {
          type: "object",
          title: "Link",
          fields: [
            {
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            },
            { name: "url", type: "string", title: "URL", validation: (Rule) => Rule.required() },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "certificationBadges",
      title: "Certification Badges",
      description: "Badges displayed in the footer (e.g., ISO, FSSAI)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Important for accessibility and SEO",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        {
          name: "facebook",
          type: "url",
          title: "Facebook",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "twitter",
          type: "url",
          title: "Twitter (X)",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "linkedin",
          type: "url",
          title: "LinkedIn",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "instagram",
          type: "url",
          title: "Instagram",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "privacyNote",
      title: "Privacy Note",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "copyrightText",
    },
    prepare({ title }) {
      return {
        title: "Footer Configuration",
        subtitle: title,
      };
    },
  },
});
