import { defineType, defineField } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "stats", title: "Hero Stats" },
    { name: "capabilities", title: "Capabilities" },
    { name: "process", title: "Process" },
    { name: "sustainability", title: "Sustainability" },
    { name: "trust", title: "Trust & Partners" },
    { name: "showcase", title: "Product Showcase" },
    { name: "about", title: "About Section" },
    { name: "media", title: "Media & Gallery" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // =========================================================================
    // HERO STATS
    // =========================================================================
    defineField({
      name: "heroStats",
      title: "Hero Stats",
      type: "array",
      group: "stats",
      of: [
        {
          type: "object",
          title: "Stat",
          fields: [
            {
              name: "value",
              type: "string",
              title: "Value",
              description: "e.g., 25+",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "label",
              type: "string",
              title: "Label",
              description: "e.g., Years Experience",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "detail",
              type: "string",
              title: "Detail",
              description: "Short sub-text",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),

    // =========================================================================
    // CAPABILITIES SECTION
    // =========================================================================
    defineField({
      name: "capabilitiesSection",
      title: "Capabilities Section",
      type: "object",
      group: "capabilities",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
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
          name: "certificationsTitle",
          type: "string",
          title: "Certifications Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "certificationsDescription",
          type: "text",
          title: "Certifications Description",
          rows: 2,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image (Google Drive or direct URL)",
        },
      ],
    }),

    // =========================================================================
    // PROCESS SECTION
    // =========================================================================
    defineField({
      name: "processSection",
      title: "Process Section",
      type: "object",
      group: "process",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
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
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image for the section",
        },
      ],
    }),

    // =========================================================================
    // SUSTAINABILITY SECTION
    // =========================================================================
    defineField({
      name: "sustainabilitySection",
      title: "Sustainability Section",
      type: "object",
      group: "sustainability",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
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
          name: "infographicImageUrl",
          type: "url",
          title: "Infographic Image URL",
          description: "Visual infographic for sustainability messaging",
        },
        {
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image (Google Drive or direct URL)",
        },
      ],
    }),

    // =========================================================================
    // FEATURED BANNER SECTION
    // =========================================================================
    defineField({
      name: "featuredBanner",
      title: "Featured Banner Section",
      type: "object",
      group: "media",
      description: "Full-width visual banner between sections",
      fields: [
        {
          name: "imageUrl",
          type: "url",
          title: "Banner Image URL",
          description: "Large banner image (facility photo, team, etc.)",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "title",
          type: "string",
          title: "Overlay Title",
          description: "Optional text overlay on the banner",
        },
        {
          name: "subtitle",
          type: "string",
          title: "Overlay Subtitle",
          description: "Optional subtitle/tagline",
        },
      ],
    }),

    // =========================================================================
    // POSTER BANNER SECTION
    // =========================================================================
    defineField({
      name: "posterBannerSection",
      title: "Poster Banner Section",
      type: "object",
      group: "media",
      description: "Promotional poster banner displayed between Hero and Quote sections",
      fields: [
        {
          name: "imageUrl",
          type: "url",
          title: "Poster Image URL",
          description: "Google Drive or direct URL to the poster image",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Accessibility description of the poster",
        },
        {
          name: "title",
          type: "string",
          title: "Overlay Title (Optional)",
          description: "Optional text overlay on the poster",
        },
      ],
    }),

    // =========================================================================
    // DRONE DIARIES SECTION
    // =========================================================================
    defineField({
      name: "droneDiaries",
      title: "Drone Diaries (Video Gallery)",
      type: "object",
      group: "media",
      description: "Aerial tour and behind-the-scenes video gallery",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          title: "Description",
          rows: 2,
        },
        {
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image (Google Drive or direct URL)",
        },
        {
          name: "videos",
          title: "Videos",
          type: "array",
          of: [
            {
              type: "object",
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
                  title: "Video Description",
                  rows: 2,
                },
                {
                  name: "videoUrl",
                  type: "url",
                  title: "Video URL (YouTube/Vimeo)",
                  validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
                },
                {
                  name: "thumbnailUrl",
                  type: "url",
                  title: "Thumbnail Image URL",
                  description: "Custom thumbnail (optional)",
                },
              ],
            },
          ],
        },
      ],
    }),

    // =========================================================================
    // TRUST SECTION
    // =========================================================================
    defineField({
      name: "trustSection",
      title: "Trust Section",
      type: "object",
      group: "trust",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
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
          name: "partnerSegments",
          title: "Partner Segments",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image (Google Drive or direct URL)",
        },
      ],
    }),

    // =========================================================================
    // PRODUCT SHOWCASE SECTION
    // =========================================================================
    defineField({
      name: "productShowcaseSection",
      title: "Product Showcase Section",
      type: "object",
      group: "showcase",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
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
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image (Google Drive or direct URL)",
        },
      ],
    }),

    // =========================================================================
    // SPIRAL QUOTE SECTION
    // =========================================================================
    defineField({
      name: "spiralQuoteSection",
      title: "Spiral Quote Section",
      type: "object",
      group: "about",
      fields: [
        {
          name: "buttonText",
          type: "string",
          title: "Button Text",
          initialValue: "Discover Our Story",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "backgroundImageUrl",
          type: "url",
          title: "Background Image URL",
          description: "Optional background image (Google Drive or direct URL)",
        },
      ],
    }),

    // =========================================================================
    // VIDEO GALLERY
    // =========================================================================
    defineField({
      name: "videoGallery",
      title: "Video Gallery (Behind the Scenes)",
      type: "object",
      group: "media",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
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
          name: "videos",
          title: "Videos",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "title",
                  type: "string",
                  title: "Title",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 2,
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "videoUrl",
                  type: "url",
                  title: "Video URL",
                  validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
                },
              ],
            },
          ],
        },
      ],
    }),

    // =========================================================================
    // ABOUT SECTION
    // =========================================================================
    defineField({
      name: "aboutSection",
      title: "About Section Content",
      type: "object",
      group: "about",
      fields: [
        // WHO WE ARE
        defineField({
          name: "whoWeAre",
          title: "Who We Are",
          type: "object",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            { name: "description", type: "text", title: "Description", rows: 3 },
            {
              name: "stats",
              title: "Statistics",
              type: "array",
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
        // MISSION
        defineField({
          name: "mission",
          title: "Mission",
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
        }),
        // VISION
        defineField({
          name: "vision",
          title: "Vision",
          type: "object",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
        }),
        // COMMITMENT
        defineField({
          name: "commitment",
          title: "Commitment",
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
        }),
        // TIMELINE
        defineField({
          name: "timeline",
          title: "Timeline",
          type: "object",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "entries",
              title: "Timeline Entries",
              type: "array",
              of: [{ type: "reference", to: [{ type: "timeline" }] }],
            },
          ],
        }),
        // DISTRIBUTION CTA
        defineField({
          name: "distribution",
          title: "Distribution CTA",
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: "Home Page Content",
        subtitle: "Main Landing Page Configuration",
      };
    },
  },
});
