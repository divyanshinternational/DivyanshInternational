import { defineType, defineField } from "sanity";

// Shared language config matching @/context/LanguageContext
const supportedLanguages = [
  { id: "en", title: "English", isDefault: true },
  { id: "ar", title: "Arabic" },
  { id: "hi", title: "Hindi" },
  { id: "fr", title: "French" },
];

export default defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: supportedLanguages.map((lang) =>
    defineField({
      title: lang.title,
      name: lang.id,
      type: "string",
      ...(lang.isDefault ? {} : { fieldset: "translations" }),
    })
  ),
  preview: {
    select: {
      title: "en",
      subtitle: "ar",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "No translation",
        subtitle: subtitle ? `AR: ${subtitle}` : "No Arabic translation",
      };
    },
  },
});
