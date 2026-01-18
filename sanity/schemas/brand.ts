import { defineType, defineField } from "sanity";

export default defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
        },
      ],
    }),
    defineField({
      name: "brandCopy",
      title: "Brand Copy",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "productSKUs",
      title: "Product SKUs",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "distributionContacts",
      title: "Distribution Contacts",
      type: "array",
      of: [
        {
          type: "object",
          title: "Contact Person",
          fields: [
            { name: "name", type: "string", title: "Name" },
            { name: "email", type: "string", title: "Email" },
            { name: "phone", type: "string", title: "Phone" },
          ],
        },
      ],
    }),
    defineField({
      name: "specSheetPDF",
      title: "Spec Sheet PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
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
      title: "name",
      media: "heroImage",
    },
  },
});
