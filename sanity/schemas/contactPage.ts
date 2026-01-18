import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "header", title: "Header" },
    { name: "labels", title: "Labels & UI" },
    { name: "meta", title: "Metadata" },
    { name: "contact", title: "Contact Info" },
    { name: "hours", title: "Business Hours" },
  ],
  fields: [
    // =========================================================================
    // HEADER
    // =========================================================================
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      group: "header",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Main Title",
      type: "string",
      group: "header",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "header",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),

    // =========================================================================
    // LABELS & UI
    // =========================================================================
    defineField({
      name: "generalEnquiryLabel",
      title: "Tab Label: General Enquiry",
      type: "string",
      group: "labels",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tradeEnquiryLabel",
      title: "Tab Label: Trade Enquiry",
      type: "string",
      group: "labels",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactDetailsTitle",
      title: "Section Title: Contact Details",
      type: "string",
      group: "labels",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessHoursTitle",
      title: "Section Title: Business Hours",
      type: "string",
      group: "labels",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerNote",
      title: "Footer Note",
      type: "string",
      group: "labels",
      description: "Displayed at the bottom of the contact section",
      validation: (Rule) => Rule.required(),
    }),

    // =========================================================================
    // CONTACT INFO
    // =========================================================================
    defineField({
      name: "contactDetails",
      title: "Contact Details",
      type: "object",
      group: "contact",
      fields: [
        {
          name: "address",
          type: "text",
          title: "Physical Address",
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "phone",
          type: "array",
          title: "Phone Numbers",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
        },
        {
          name: "email",
          type: "string",
          title: "Email Address",
          validation: (Rule) => Rule.required().email(),
        },
      ],
    }),

    // =========================================================================
    // BUSINESS HOURS
    // =========================================================================
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "object",
      group: "hours",
      fields: [
        {
          name: "weekdays",
          type: "string",
          title: "Weekdays Schedule",
          description: "e.g., Monday – Saturday: 9:00 AM – 6:00 PM",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "sunday",
          type: "string",
          title: "Sunday Schedule",
          description: "e.g., Sunday: Closed",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
