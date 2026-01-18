import { defineType, defineField } from "sanity";

// Shared language config matching @/context/LanguageContext
const supportedLanguages = [
  { id: "en", title: "English", isDefault: true },
  { id: "ar", title: "Arabic" },
  { id: "hi", title: "Hindi" },
  { id: "fr", title: "French" },
];

export default defineType({
  name: "localeText",
  title: "Localized Text (Block)",
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
      type: "text",
      ...(lang.isDefault ? {} : { fieldset: "translations" }),
      rows: 3,
    })
  ),
  preview: {
    select: {
      title: "en",
      subtitle: "ar",
    },
    prepare({ title, subtitle }) {
      return {
        title: title
          ? title.length > 50
            ? `${title.substring(0, 50)}...`
            : title
          : "No English text",
        subtitle: subtitle ? `AR: ${subtitle.substring(0, 30)}...` : "No Arabic translation",
      };
    },
  },
});
