import { type SchemaTypeDefinition } from "sanity";

// Pages (Singletons/Documents)
import homePage from "./homePage";
import about from "./about";
import community from "./community";
import contactPage from "./contactPage";
import productsPage from "./productsPage";
import privacyPolicy from "./privacyPolicy";

// Global Configuration
import siteSettings from "./siteSettings";
import header from "./header";
import footer from "./footer";
import catalogueSettings from "./catalogueSettings";

// Core Business Documents
import product from "./product";
import brand from "./brand";

// Page Sections & Modules
import heroSlide from "./heroSlide";
import cta from "./cta";
import testimonialsSection from "./testimonialsSection";

// Data Objects & Components
import capability from "./capability";
import certificate from "./certificate";
import distributionRegion from "./distribution";
import processStep from "./process";
import sustainabilityPillar from "./sustainability";
import teamMember from "./teamMember";
import testimonial from "./testimonial";
import timeline from "./timeline";
import value from "./value";
import quote from "./quote";
import contentBanner from "./contentBanner";

// Utilities & Localization
import localeString from "./localeString";
import localeText from "./localeText";
import gallerySettings from "./gallerySettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Pages
  homePage,
  about,
  community,
  contactPage,
  productsPage,
  privacyPolicy,

  // Global Config
  siteSettings,
  header,
  footer,
  catalogueSettings,

  // Core Documents
  product,
  brand,

  // Sections
  heroSlide,
  cta,
  testimonialsSection,

  // Components/Objects
  capability,
  certificate,
  distributionRegion,
  processStep,
  sustainabilityPillar,
  teamMember,
  testimonial,
  timeline,
  value,
  quote,
  contentBanner,

  // Utils
  localeString,
  localeText,

  // Gallery
  gallerySettings,
];
