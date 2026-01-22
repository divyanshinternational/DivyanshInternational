import { defineType, defineField } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  groups: [
    { name: "posters", title: "Poster Slider" },
    { name: "header", title: "Page Header" },
    { name: "storySections", title: "Story Sections" },
    { name: "coreValues", title: "Core Values" },
    { name: "brands", title: "Brands & Products" },
    { name: "team", title: "Team & Journey" },
    { name: "distribution", title: "Distribution" },
  ],
  fields: [
    // =========================================================================
    // POSTER SLIDER SECTION
    // =========================================================================
    defineField({
      name: "posterSliderSection",
      title: "Poster Slider Section",
      type: "object",
      group: "posters",
      description: "Hero-like slider for promotional posters at the top of the About page",
      fields: [
        {
          name: "enabled",
          type: "boolean",
          title: "Enable Poster Slider",
          description: "Show/hide the poster slider section",
          initialValue: true,
        },
        {
          name: "autoPlayInterval",
          type: "number",
          title: "Auto-play Interval (ms)",
          description: "Time between slides in milliseconds (default: 5000)",
          initialValue: 5000,
        },
        {
          name: "posters",
          title: "Posters",
          type: "array",
          of: [{ type: "contentBanner" }],
        },
      ],
    }),

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
    // CORE VALUES
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
          name: "partners",
          type: "object",
          title: "Partners Brands",
          fields: [
            { name: "title", type: "string", title: "Title" },
            {
              name: "names",
              type: "array",
              title: "Brand Names",
              of: [{ type: "string" }],
            },
            { name: "description", type: "string", title: "Description" },
            { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
          ],
        },
        {
          name: "retail",
          type: "object",
          title: "Retail Brands",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "name", type: "string", title: "Brand Name" },
            { name: "description", type: "string", title: "Description" },
            { name: "imageUrl", type: "string", title: "Image URL (Google Drive)" },
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
