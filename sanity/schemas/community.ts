import { defineType, defineField } from "sanity";

export default defineType({
  name: "community",
  title: "Community",
  type: "document",
  groups: [
    { name: "header", title: "Page Header" },
    { name: "philosophy", title: "Core Philosophy" },
    { name: "education", title: "Education Section" },
    { name: "womenEmpowerment", title: "Women Empowerment" },
    { name: "childcare", title: "Childcare & Learning" },
    { name: "industry", title: "Industry Collaboration" },
    { name: "environment", title: "Environmental Responsibility" },
    { name: "employeeStories", title: "Employee Stories" },
    { name: "events", title: "Trade Events" },
    { name: "closingMessage", title: "Closing Message" },
  ],
  fields: [
    // =========================================================================
    // PAGE HEADER
    // =========================================================================
    defineField({
      name: "header",
      title: "Page Header",
      type: "object",
      group: "header",
      fields: [
        {
          name: "eyebrow",
          type: "string",
          title: "Eyebrow Text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "title",
          type: "string",
          title: "Main Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "subtitle",
          type: "text",
          title: "Subtitle",
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // =========================================================================
    // CORE PHILOSOPHY
    // =========================================================================
    defineField({
      name: "corePhilosophy",
      title: "Core Philosophy",
      type: "object",
      group: "philosophy",
      fields: [
        {
          name: "paragraph",
          type: "text",
          title: "Main Paragraph",
          rows: 4,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "highlight",
          type: "text",
          title: "Highlight Text",
          rows: 3,
        },
      ],
    }),

    // =========================================================================
    // EDUCATION SECTION
    // =========================================================================
    defineField({
      name: "educationSection",
      title: "Education Section",
      type: "object",
      group: "education",
      fields: [
        { name: "icon", type: "string", title: "Icon (emoji)" },
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text", rows: 3 }],
        },
        { name: "quote", type: "text", title: "Quote Text", rows: 3 },
        {
          name: "images",
          type: "array",
          title: "Images (Google Drive URLs)",
          of: [{ type: "string" }],
        },
      ],
    }),

    // =========================================================================
    // WOMEN EMPOWERMENT
    // =========================================================================
    defineField({
      name: "womenEmpowerment",
      title: "Women Empowerment Section",
      type: "object",
      group: "womenEmpowerment",
      fields: [
        { name: "icon", type: "string", title: "Icon (emoji)" },
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text", rows: 3 }],
        },
        { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
      ],
    }),

    // =========================================================================
    // CHILDCARE & LEARNING
    // =========================================================================
    defineField({
      name: "childcareSection",
      title: "Childcare & Learning Section",
      type: "object",
      group: "childcare",
      fields: [
        { name: "icon", type: "string", title: "Icon (emoji)" },
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text", rows: 3 }],
        },
        { name: "highlight", type: "text", title: "Highlight Text", rows: 3 },
        { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
      ],
    }),

    // =========================================================================
    // INDUSTRY COLLABORATION
    // =========================================================================
    defineField({
      name: "industryCollaboration",
      title: "Industry Collaboration Section",
      type: "object",
      group: "industry",
      fields: [
        { name: "icon", type: "string", title: "Icon (emoji)" },
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text", rows: 3 }],
        },
        { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
      ],
    }),

    // =========================================================================
    // ENVIRONMENTAL RESPONSIBILITY
    // =========================================================================
    defineField({
      name: "environmentalSection",
      title: "Environmental Responsibility Section",
      type: "object",
      group: "environment",
      fields: [
        { name: "icon", type: "string", title: "Icon (emoji)" },
        { name: "title", type: "string", title: "Title" },
        { name: "introText", type: "text", title: "Intro Text", rows: 3 },
        {
          name: "initiatives",
          type: "array",
          title: "Environmental Initiatives",
          of: [
            {
              type: "object",
              fields: [
                { name: "icon", type: "string", title: "Icon (emoji)" },
                { name: "text", type: "string", title: "Initiative Text" },
              ],
            },
          ],
        },
        { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
      ],
    }),

    // =========================================================================
    // EMPLOYEE STORIES
    // =========================================================================
    defineField({
      name: "employeeStories",
      title: "Employee Stories",
      type: "object",
      group: "employeeStories",
      fields: [
        {
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          validation: (Rule) => Rule.max(50),
        },
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => Rule.required().max(100),
        },
        {
          name: "placeholderText",
          type: "string",
          title: "Placeholder Text",
          description: "Alt text for the video area.",
        },
        {
          name: "videos",
          type: "array",
          title: "Video Slider",
          description: "Employee stories videos.",
          of: [
            {
              type: "object",
              title: "Video",
              fields: [
                {
                  name: "title",
                  type: "string",
                  title: "Video Title",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 2,
                },
                {
                  name: "videoUrl",
                  type: "url",
                  title: "Video URL",
                },
                {
                  name: "thumbnail",
                  type: "image",
                  title: "Thumbnail",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alt Text",
                    },
                  ],
                },
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "description",
                  media: "thumbnail",
                },
              },
            },
          ],
        },
        {
          name: "highlights",
          type: "array",
          title: "Highlights / Stats",
          description: "Key stats or points.",
          of: [{ type: "string" }],
        },
        {
          name: "note",
          type: "string",
          title: "Footer Note",
          description: "Small text at the bottom.",
        },
      ],
    }),

    // =========================================================================
    // TRADE EVENTS
    // =========================================================================
    defineField({
      name: "tradeEventsSection",
      title: "Trade Events Section",
      type: "object",
      group: "events",
      fields: [
        { name: "title", type: "string", title: "Section Title" },
        { name: "subtitle", type: "string", title: "Section Subtitle" },
      ],
    }),
    defineField({
      name: "tradeEvents",
      title: "Trade Events",
      type: "array",
      group: "events",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Event Name" },
            { name: "date", type: "date", title: "Event Date" },
            { name: "location", type: "string", title: "Location" },
            { name: "description", type: "text", title: "Event Description", rows: 3 },
            { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
            {
              name: "image",
              type: "image",
              title: "Event Image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                  description: "Important for accessibility and SEO.",
                },
              ],
            },
          ],
        },
      ],
    }),

    // =========================================================================
    // CLOSING MESSAGE
    // =========================================================================
    defineField({
      name: "closingMessage",
      title: "Growing With Purpose Section",
      type: "object",
      group: "closingMessage",
      fields: [
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text", rows: 3 }],
        },
        { name: "finalHighlight", type: "text", title: "Final Highlight", rows: 3 },
      ],
    }),
  ],
  preview: {
    select: {
      title: "header.title",
      subtitle: "header.subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Community Page",
        subtitle: subtitle || "Community initiatives and sustainability",
      };
    },
  },
});
