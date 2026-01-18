import { defineType, defineField } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  groups: [
    { name: "header", title: "Page Header" },
    { name: "storySections", title: "Story Sections" },
    { name: "coreValues", title: "Core Values" },
    { name: "brands", title: "Brands & Products" },
    { name: "team", title: "Team & Journey" },
    { name: "distribution", title: "Distribution" },
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
        { name: "eyebrow", type: "string", title: "Eyebrow Text" },
        { name: "title", type: "string", title: "Main Title" },
        { name: "subtitle", type: "string", title: "Subtitle" },
      ],
    }),

    // =========================================================================
    // STORY SECTIONS
    // =========================================================================
    defineField({
      name: "openingStory",
      title: "Opening Story",
      type: "object",
      group: "storySections",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "highlight", type: "string", title: "Highlight Text" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text" }],
        },
      ],
    }),
    defineField({
      name: "anjeerStory",
      title: "Anjeer Story (A Memory That Defines Us)",
      type: "object",
      group: "storySections",
      fields: [
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text" }],
        },
      ],
    }),
    defineField({
      name: "birthSection",
      title: "Birth of Divyansh Section",
      type: "object",
      group: "storySections",
      fields: [
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text" }],
        },
        { name: "boxTitle", type: "string", title: "Box Title" },
        { name: "boxText", type: "text", title: "Box Text" },
      ],
    }),
    defineField({
      name: "growingSection",
      title: "Growing While Staying Rooted",
      type: "object",
      group: "storySections",
      fields: [
        { name: "title", type: "string", title: "Title" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text" }],
        },
      ],
    }),
    defineField({
      name: "philosophySection",
      title: "Philosophy Section",
      type: "object",
      group: "storySections",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "highlight", type: "string", title: "Highlight Text" },
        {
          name: "paragraphs",
          type: "array",
          title: "Paragraphs",
          of: [{ type: "text" }],
        },
      ],
    }),
    defineField({
      name: "timelineSummaryCards",
      title: "Timeline Summary Cards",
      type: "array",
      group: "storySections",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "string", title: "Description" },
          ],
        },
      ],
    }),

    // =========================================================================
    // CORE VALUES (Existing)
    // =========================================================================
    defineField({
      name: "ourStory",
      title: "Our Story",
      type: "object",
      group: "coreValues",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "title", type: "string", title: "Title" },
        { name: "description", type: "text", title: "Description" },
      ],
    }),
    defineField({
      name: "whoWeAre",
      title: "Who We Are",
      type: "object",
      group: "coreValues",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "description", type: "text", title: "Description" },
        { name: "image", type: "image", title: "Image" },
        {
          name: "stats",
          type: "array",
          title: "Stats",
          of: [
            {
              type: "object",
              fields: [
                { name: "value", type: "string", title: "Value" },
                { name: "label", type: "string", title: "Label" },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: "mission",
      title: "Mission",
      type: "object",
      group: "coreValues",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "description", type: "text", title: "Description" },
      ],
    }),
    defineField({
      name: "vision",
      title: "Vision",
      type: "object",
      group: "coreValues",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "description", type: "text", title: "Description" },
      ],
    }),
    defineField({
      name: "commitment",
      title: "Commitment",
      type: "object",
      group: "coreValues",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "description", type: "text", title: "Description" },
      ],
    }),

    // =========================================================================
    // BRANDS & PRODUCTS
    // =========================================================================
    defineField({
      name: "brandsSection",
      title: "Our Premium Brands Section",
      type: "object",
      group: "brands",
      fields: [
        { name: "title", type: "string", title: "Section Title" },
        {
          name: "b2b",
          type: "object",
          title: "B2B Brands",
          fields: [
            { name: "title", type: "string", title: "Title" },
            {
              name: "names",
              type: "array",
              title: "Brand Names",
              of: [{ type: "string" }],
            },
            { name: "description", type: "string", title: "Description" },
          ],
        },
        {
          name: "d2c",
          type: "object",
          title: "D2C Brands",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "name", type: "string", title: "Brand Name" },
            { name: "description", type: "string", title: "Description" },
          ],
        },
      ],
    }),
    defineField({
      name: "productRangeSection",
      title: "Product Range Section",
      type: "object",
      group: "brands",
      fields: [
        { name: "title", type: "string", title: "Section Title" },
        {
          name: "products",
          type: "array",
          title: "Product Names",
          of: [{ type: "string" }],
        },
        { name: "description", type: "text", title: "Description" },
      ],
    }),

    // =========================================================================
    // TEAM & JOURNEY
    // =========================================================================
    defineField({
      name: "teamSection",
      title: "Team Section",
      type: "object",
      group: "team",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "title", type: "string", title: "Title" },
      ],
    }),
    defineField({
      name: "journeySection",
      title: "Journey Section",
      type: "object",
      group: "team",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "title", type: "string", title: "Title" },
      ],
    }),

    // =========================================================================
    // DISTRIBUTION
    // =========================================================================
    defineField({
      name: "distributionRegions",
      title: "Distribution Regions",
      type: "array",
      group: "distribution",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Name" },
            { name: "description", type: "string", title: "Description" },
            { name: "lat", type: "number", title: "Latitude" },
            { name: "lng", type: "number", title: "Longitude" },
            { name: "radius", type: "number", title: "Radius (m)", initialValue: 50000 },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: "About Page Content",
        subtitle: "Our Story & Mission",
      };
    },
  },
});
