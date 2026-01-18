import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Video Testimonial",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "role",
      title: "Role / Company",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.max(100),
      description: "Job title or company name of the testimonial author.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.max(100),
      description: "City, Country (e.g., 'Dubai, UAE').",
    }),
    defineField({
      name: "quote",
      title: "Testimonial Quote",
      type: "text",
      group: "content",
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
      description: "The testimonial text (max 500 characters).",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "media",
      description: "Link to YouTube or Vimeo video.",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Accessibility description.",
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Author Name",
      name: "authorAsc",
      by: [{ field: "author", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "role",
      media: "thumbnail",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Unnamed Testimonial",
        subtitle: subtitle || "No role",
        media,
      };
    },
  },
});
