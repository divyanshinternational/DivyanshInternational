/**
 * PostCSS Configuration
 * @see https://postcss.org/docs/
 * @type {import('postcss').ProcessOptions & { plugins: Record<string, object> }}
 */
const config = {
  plugins: {
    /**
     * Tailwind CSS v4 PostCSS Plugin
     * @see https://tailwindcss.com/docs/installation/using-postcss
     */
    "@tailwindcss/postcss": {},
  },
};

export default config;
