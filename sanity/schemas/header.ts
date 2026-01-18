import { defineType, defineField } from "sanity";

export default defineType({
  name: "header",
  title: "Header",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "accessibility", title: "Accessibility" },
  ],
  fields: [
    // =========================================================================
    // CONTENT
    // =========================================================================
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for accessibility (leave blank if decorative)",
        },
      ],
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      group: "content",
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
            {
              name: "url",
              type: "string",
              title: "URL",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "tradeButtonText",
      title: "CTA: Trade Button Text",
      type: "string",
      group: "content",
      initialValue: "Get Trade Quote",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsappText",
      title: "CTA: WhatsApp Button Text",
      type: "string",
      group: "content",
      initialValue: "Chat with us",
    }),

    // =========================================================================
    // ACCESSIBILITY
    // =========================================================================
    defineField({
      name: "logoAlt",
      title: "Logo SEO Alt Text",
      type: "string",
      group: "accessibility",
      description: "Fallback alt text for the main logo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "homeAriaLabel",
      title: "Home Link Aria Label",
      type: "string",
      group: "accessibility",
      initialValue: "Go to homepage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "navAriaLabel",
      title: "Navigation Aria Label",
      type: "string",
      group: "accessibility",
      initialValue: "Main navigation",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "menuAriaLabel",
      title: "Mobile Menu Open Aria Label",
      type: "string",
      group: "accessibility",
      initialValue: "Open mobile menu",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "closeMenuAriaLabel",
      title: "Mobile Menu Close Aria Label",
      type: "string",
      group: "accessibility",
      initialValue: "Close mobile menu",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productsLabel",
      title: "Mobile Products Menu Label",
      type: "string",
      group: "content",
      initialValue: "Products",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "logoAlt",
      subtitle: "tradeButtonText",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Header Configuration",
        subtitle: subtitle ? `CTA: ${subtitle}` : "Main Header",
        media,
      };
    },
  },
});
