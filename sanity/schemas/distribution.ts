import { defineType, defineField } from "sanity";

export default defineType({
  name: "distributionRegion",
  title: "Distribution Region",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Region Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "lat",
      title: "Latitude",
      type: "number",
      description: "Decimal coordinates (e.g., 30.7333)",
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: "lng",
      title: "Longitude",
      type: "number",
      description: "Decimal coordinates (e.g., 76.7794)",
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: "radius",
      title: "Coverage Radius (meters)",
      type: "number",
      description: "Radius in meters (e.g., 50000 for 50km)",
      initialValue: 50000,
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "New Region",
        subtitle: subtitle || "Distribution Hub",
      };
    },
  },
});
