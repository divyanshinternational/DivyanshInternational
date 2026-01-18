/**
 * ==============================================================================
 * ESLINT CONFIGURATION (ESLint 9 Flat Config + Next.js 16)
 * ==============================================================================
 * This configuration uses the new ESLint flat config format (eslint.config.mjs)
 * with Next.js 16 recommended rules and strict TypeScript settings.
 *
 * Key Features:
 *   - Next.js Core Web Vitals rules
 *   - Strict TypeScript (no any, consistent imports)
 *   - React 19 best practices
 *   - Security rules (no dangerouslySetInnerHTML)
 * ==============================================================================
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // ===========================================================================
  // NEXT.JS PRESETS
  // ===========================================================================
  ...nextVitals,
  ...nextTs,

  // ===========================================================================
  // GLOBAL IGNORES
  // ===========================================================================
  globalIgnores([
    // Build outputs
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",

    // Generated files
    "next-env.d.ts",
    "*.tsbuildinfo",
    "sanity.types.ts",
    "schema.json",

    // Dependencies
    "node_modules/**",

    // Sanity Studio (has its own lint config)
    ".sanity/**",

    // Third-party minified files
    "public/pdf.worker.min.mjs",

    // Cache
    ".turbo/**",
    ".vercel/**",
  ]),

  // ===========================================================================
  // CUSTOM RULES
  // ===========================================================================
  {
    rules: {
      // -------------------------------------------------------------------------
      // TYPESCRIPT STRICT MODE
      // -------------------------------------------------------------------------
      // Ban explicit 'any' - forces proper typing
      "@typescript-eslint/no-explicit-any": "error",

      // Error on unused variables (except those starting with _)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Enforce type-only imports for better tree-shaking
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      // -------------------------------------------------------------------------
      // JAVASCRIPT BEST PRACTICES
      // -------------------------------------------------------------------------
      // Restrict console (allow warn/error/info for legitimate logging)
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // Prefer const over let when variable is never reassigned
      "prefer-const": "error",

      // Require strict equality (=== instead of ==)
      eqeqeq: ["error", "always"],

      // Disallow debugger statements in production
      "no-debugger": "error",

      // Disallow eval() - security risk
      "no-eval": "error",

      // -------------------------------------------------------------------------
      // REACT / NEXT.JS RULES
      // -------------------------------------------------------------------------
      // Ban dangerouslySetInnerHTML - security risk (XSS)
      "react/no-danger": "error",

      // Prevent leaked renders (e.g., {count && <Component />} when count=0)
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary"] }],

      // Ensure keys are used correctly in lists
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],

      // -------------------------------------------------------------------------
      // IMPORT ORGANIZATION (if using eslint-plugin-import)
      // -------------------------------------------------------------------------
      // Uncomment if eslint-plugin-import is installed:
      // "import/order": [
      //   "error",
      //   {
      //     groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      //     "newlines-between": "always",
      //     alphabetize: { order: "asc", caseInsensitive: true },
      //   },
      // ],
    },
  },
]);

export default eslintConfig;
