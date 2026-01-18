import { CogIcon, EarthGlobeIcon, BookIcon } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { defineConfig, type SingleWorkspace } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";

import { env } from "@/lib/env";
import { schemaTypes } from "./sanity/schemas";

/**
 * Sanity Studio Configuration
 * @see https://www.sanity.io/docs/configuration
 */

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;

/**
 * Singleton document IDs for settings-type documents
 * These ensure only one instance exists
 */
const SINGLETON_TYPES = ["siteSettings", "catalogueSettings"] as const;

/**
 * Custom desk structure for organizing content in Sanity Studio
 */
function createDeskStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      // Settings Group
      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Settings")
            .items([
              S.listItem()
                .title("Site Settings")
                .icon(EarthGlobeIcon)
                .schemaType("siteSettings")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Site Settings")
                ),
              S.listItem()
                .title("Catalogue Settings")
                .icon(BookIcon)
                .schemaType("catalogueSettings")
                .child(
                  S.document()
                    .schemaType("catalogueSettings")
                    .documentId("catalogueSettings")
                    .title("Catalogue Settings")
                ),
            ])
        ),

      // Divider
      S.divider(),

      // All other document types (excluding singletons)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !SINGLETON_TYPES.includes(listItem.getId() as (typeof SINGLETON_TYPES)[number])
      ),
    ]);
}

const config: SingleWorkspace = {
  name: "default",
  title: "Divyansh International",
  basePath: "/studio",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: createDeskStructure,
    }),
    visionTool({
      defaultApiVersion: "2024-01-01",
    }),
  ],

  schema: {
    types: schemaTypes,

    // Prevent creation of new singleton documents via "New document" button
    templates: (templates) =>
      templates.filter(
        (template) =>
          !SINGLETON_TYPES.includes(template.schemaType as (typeof SINGLETON_TYPES)[number])
      ),
  },

  document: {
    // Prevent actions that would create/delete singleton documents
    actions: (input, context) =>
      SINGLETON_TYPES.includes(context.schemaType as (typeof SINGLETON_TYPES)[number])
        ? input.filter(
            ({ action }) => action && !["unpublish", "delete", "duplicate"].includes(action)
          )
        : input,
  },
};

export default defineConfig(config);
