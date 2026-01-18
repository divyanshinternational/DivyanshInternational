import { defineType, defineField } from "sanity";

export default defineType({
  name: "cta",
  title: "Call to Action",
  type: "document",
  groups: [
    { name: "walkthrough", title: "Walkthrough" },
    { name: "pricing", title: "Pricing" },
  ],
  fields: [
    // =========================================================================
    // WALKTHROUGH SECTION
    // =========================================================================
    defineField({
      name: "walkthrough",
      title: "Walkthrough Section",
      type: "object",
      group: "walkthrough",
      fields: [
        {
          name: "subtitle",
          type: "string",
          title: "Subtitle",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "title",
          type: "string",
          title: "Main Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          title: "Description",
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "buttonText",
          type: "string",
          title: "Button Text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // =========================================================================
    // PRICING SECTION
    // =========================================================================
    defineField({
      name: "pricing",
      title: "Pricing Section",
      type: "object",
      group: "pricing",
      fields: [
        {
          name: "subtitle",
          type: "string",
          title: "Subtitle",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "title",
          type: "string",
          title: "Main Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          title: "Description",
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "buttonText",
          type: "string",
          title: "Button Text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "emailPlaceholder",
          type: "string",
          title: "Email Input Placeholder",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "walkthrough.title",
      subtitle: "pricing.title",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Call to Action",
        subtitle: subtitle ? `Pricing: ${subtitle}` : "Global CTAs",
      };
    },
  },
});
