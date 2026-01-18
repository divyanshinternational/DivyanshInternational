import { defineType, defineField } from "sanity";

export default defineType({
  name: "catalogueSettings",
  title: "Catalogue Settings",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Catalogue Title",
      type: "string",
      group: "content",
      initialValue: "Product Catalogue",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Catalogue Description",
      type: "text",
      group: "content",
      rows: 3,
      initialValue:
        "Explore our premium collection of dry fruits, nuts, and specialty products with our interactive digital catalogue.",
    }),
    defineField({
      name: "contentType",
      title: "Content Type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "PDF Catalogue", value: "pdf" },
          { title: "Image Pages", value: "images" },
        ],
        layout: "radio",
      },
      initialValue: "images",
      description: "Choose whether to use a PDF file or individual images for catalogue pages",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pdfFile",
      title: "PDF Catalogue File",
      description:
        "Upload your catalogue as a PDF file. Each page will be rendered with page-flip animation.",
      type: "file",
      group: "content",
      options: {
        accept: ".pdf",
      },
      hidden: ({ document }) => document?.["contentType"] !== "pdf",
    }),
    defineField({
      name: "pages",
      title: "Catalogue Pages",
      description:
        "Upload images for each page of your catalogue. Order matters - first image is the cover.",
      type: "array",
      group: "content",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Description for accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Page Caption (Optional)",
            },
          ],
        },
      ],
      hidden: ({ document }) => document?.["contentType"] !== "images",
      validation: (Rule) =>
        Rule.custom((pages, context) => {
          if (context.document?.["contentType"] === "images" && (!pages || pages.length < 2)) {
            return "Please add at least 2 pages for the catalogue";
          }
          return true;
        }),
    }),
    defineField({
      name: "pdfDownloadUrl",
      title: "PDF Download URL (Optional)",
      description: "Direct link to downloadable PDF version for users who want to download",
      type: "url",
      group: "content",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      description:
        "Cover image shown before the catalogue loads (optional, uses first page if not set)",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "version",
      title: "Catalogue Version",
      description: "Version number or identifier for the catalogue (e.g., 2024.1)",
      type: "string",
      group: "settings",
      initialValue: "2024.1",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
      group: "settings",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      description: "Enable/disable the catalogue",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
    defineField({
      name: "showThumbnails",
      title: "Show Thumbnails",
      description: "Show thumbnail navigation strip",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
    defineField({
      name: "showPageNumbers",
      title: "Show Page Numbers",
      description: "Display page numbers on the catalogue",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      version: "version",
      isActive: "isActive",
      contentType: "contentType",
      pdfFile: "pdfFile.asset",
      pages: "pages",
    },
    prepare({ title, version, isActive, contentType, pdfFile, pages }) {
      const hasContent = contentType === "pdf" ? !!pdfFile : pages && pages.length > 0;
      const pageCount = contentType === "images" ? pages?.length || 0 : "PDF";
      return {
        title: title || "Catalogue",
        subtitle: `v${version || "N/A"} • ${isActive ? "Active" : "Inactive"} • ${contentType?.toUpperCase() || "N/A"} • ${typeof pageCount === "number" ? `${pageCount} pages` : pageCount} ${hasContent ? "✓" : "⚠️ No content"}`,
      };
    },
  },
});
