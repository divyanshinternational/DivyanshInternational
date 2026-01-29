import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const requiredEnvVars = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"],
  NEXT_PUBLIC_SANITY_DATASET: process.env["NEXT_PUBLIC_SANITY_DATASET"],
  SANITY_API_TOKEN: process.env["SANITY_API_TOKEN"],
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("❌ Missing Required Environment Variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error("\n💡 Please Check Your .env.local File.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"]!,
  dataset: process.env["NEXT_PUBLIC_SANITY_DATASET"]!,
  token: process.env["SANITY_API_TOKEN"]!,
  useCdn: false,
  apiVersion: process.env["NEXT_PUBLIC_SANITY_API_VERSION"]!,
});

async function safeCreateOrReplace(
  doc: { _id: string; _type: string; [key: string]: unknown },
  retries = 3
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await client.createOrReplace(doc);
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`   ⚠️  Retry ${attempt}/${retries} For ${doc._id}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

function createLocaleString(enText: string) {
  return {
    en: enText,
    ar: "",
    hi: "",
    fr: "",
  };
}

function createLocaleText(enText: string) {
  return {
    en: enText,
    ar: "",
    hi: "",
    fr: "",
  };
}

const products = [
  {
    _id: "product-almonds",
    title: createLocaleString("Almonds"),
    category: "almonds",
    slug: { current: "almonds" },
    order: 1,
    heroHeading: createLocaleString("Premium Almonds – India’s Trusted Importer – For You"),
    introParagraphs: [
      createLocaleText(
        "Divyansh International is one of India's most reliable importers of premium almonds, offering the finest varieties from California and around the world."
      ),
      createLocaleText(
        "We directly source high-quality raw almonds from trusted growers in Australia and Kashmir — ensuring consistency, freshness and the best quality for our customers."
      ),
    ],
    listSections: [
      {
        _key: "ls-1",
        title: createLocaleString("Grades & Size Options"),
        items: [
          createLocaleString("Extra Jumbo, Jumbo"),
          createLocaleString("Gold, Diamond"),
          createLocaleString("Galaxy, Royal"),
          createLocaleString("Whole Kernels"),
        ],
      },
      {
        _key: "ls-2",
        title: createLocaleString("Processing Forms"),
        items: [
          createLocaleString("Chip & Scratch (Sui)"),
          createLocaleString("Single / Mixed Sui Touch"),
          createLocaleString("Broken Almonds"),
          createLocaleString("Diced / Sliced / Blanched"),
        ],
      },
      {
        _key: "ls-3",
        title: createLocaleString("Packaging Formats Available"),
        items: [
          createLocaleString("Inshell 50 Lbs (22.68 Kg)"),
          createLocaleString("Vacuum pouches for professional supply"),
        ],
      },
      {
        _key: "ls-4",
        title: createLocaleString("Why Choose Us As Your Almond Partner?"),
        items: [
          createLocaleString("ISO-certified quality"),
          createLocaleString("Consistent year-round supply"),
          createLocaleString("Facility for daily processing, cleaning & custom sorting"),
          createLocaleString("Fast delivery across Punjab, North India & pan-India"),
          createLocaleString("Competitive pricing for bulk almond purchase"),
        ],
      },
    ],
    productGrading: [
      {
        _key: "pg-18-20",
        grade: "18/20",
        description: "Largest Size (approx. 18-20 kernels/oz)",
        imageUrl:
          "https://drive.google.com/file/d/1cvFG01z5dZI0rpEZM8eiNExaqUwXhU_Z/view?usp=sharing",
      },
      {
        _key: "pg-20-22",
        grade: "20/22",
        description: "Extra Large (approx. 20-22 kernels/oz)",
        imageUrl:
          "https://drive.google.com/file/d/1dQN_xPNRCGMlbKBM7wAmrAWYExmriDOO/view?usp=sharing",
      },
      {
        _key: "pg-23-25",
        grade: "23/25",
        description: "Large (approx. 23-25 kernels/oz)",
        imageUrl:
          "https://drive.google.com/file/d/1J4uA4P3tXQrzh3oqWKuju0SNgHSgYDCn/view?usp=sharing",
      },
      {
        _key: "pg-25-27",
        grade: "25/27",
        description: "Medium (approx. 25-27 kernels/oz)",
        imageUrl:
          "https://drive.google.com/file/d/1xNr9rkyrWaKhaO5GKcACyZ8ajDZ-422I/view?usp=sharing",
      },
      {
        _key: "pg-27-30",
        grade: "27/30",
        description: "Small (approx. 27-30 kernels/oz)",
        imageUrl:
          "https://drive.google.com/file/d/1416sUZKJh_T8mzUlAgugw-kiKEvZqgwT/view?usp=sharing",
      },
    ],
    ctaLine: createLocaleString(
      "Looking for a dependable premium almond supplier? Contact us today for quality almond prices and available sizes."
    ),
    description: createLocaleText("Premium almonds for retail, wholesale, and export partners."),
    heroImageUrl:
      "https://drive.google.com/file/d/1Bvi9b8uryUBT9Kq_XzfKqHoEA0a8d4sG/view?usp=sharing",
    gallery: [
      {
        _key: "almond-gallery-1",
        imageUrl:
          "https://drive.google.com/file/d/1CQQuD0ahv9SPZvdmqRsmSdp5HEh-VwbH/view?usp=sharing",
        alt: "Premium California Almonds",
      },
      {
        _key: "almond-gallery-2",
        imageUrl:
          "https://drive.google.com/file/d/1zLEQiriRyXW8_GUfpkfxCvNdbbIYzEpe/view?usp=sharing",
        alt: "Almond Varieties Display",
      },
      {
        _key: "almond-gallery-3",
        imageUrl:
          "https://drive.google.com/file/d/1jgG5MWKA1qoCmq2mcLCsUVYosoXtJ5Kj/view?usp=sharing",
        alt: "Nonpareil Almonds Close-up",
      },
      {
        _key: "almond-gallery-4",
        imageUrl:
          "https://drive.google.com/file/d/1RZnNAxrE0ZZUrkEqc_C_SzVPh8uc_xiH/view?usp=sharing",
        alt: "Almond Processing Line",
      },
      {
        _key: "almond-gallery-5",
        imageUrl:
          "https://drive.google.com/file/d/1PKrVQneEVo5EOJPgOyFux1WbmfdXTZkm/view?usp=sharing",
        alt: "Blanched Almonds",
      },
    ],
    pricing: { currentPrice: 1299, originalPrice: 1599, discount: 19 },
    specifications: {
      origin: "California (USA), Australia, Spain",
      variety: "Nonpareil, Carmel, Independence (Supreme Grade)",
      packaging: "Export-Grade Bulk / Industrial Standard",
      shelfLife: "12 Months",
      storage: "Controlled Atmosphere (5-10°C / <65% RH)",
      qualitySealed: "Vacuum Sealed / Nitrogen Flush (On Request)",
      logistics: "FOB, CIF, CFR, DAP",
      standardDimensions: {
        cartonSize: "11.34 KG (25 lbs) Net",
        cartonType: "Multi-layered Corrugated Fiberboard",
        bagSize: "22.68 KG (50 lbs) / Bulk Super Sacks",
        bagType: "Multi-wall Kraft Paper / Food-Grade Vacuum Barrier",
        shelfLife: "12 Months",
        storage: "Avoid Thermal Fluctuations & Direct UV Exposure",
      },
    },
    applications: [
      "Industrial food processing and FMCG manufacturing",
      "Premium retail distribution and private labeling",
      "Confectionery, bakery, and plant-based dairy production",
      "Global export and commodity trade",
    ],

    almondVarieties: [
      {
        _key: "variety-nonpareil",
        name: "Nonpareil",
        imageUrl:
          "https://drive.google.com/file/d/1EmjKCclYG4a4b_hN3PXgsPFNmm5LPurz/view?usp=sharing",
      },
      {
        _key: "variety-independence",
        name: "Independence",
        imageUrl:
          "https://drive.google.com/file/d/1bGAfFfKdIoAmiKfHDuK76m5nGa24vESB/view?usp=sharing",
      },
      {
        _key: "variety-sonora",
        name: "Sonora",
        imageUrl:
          "https://drive.google.com/file/d/1kVmIa1ZHCSTksk3iSXM3JJ-w0rhKM_5X/view?usp=sharing",
      },
      {
        _key: "variety-carmel",
        name: "Carmel",
        imageUrl:
          "https://drive.google.com/file/d/1S7rW2vMTg5-vxd-VFmI8t6tM8judT2_n/view?usp=sharing",
      },
      {
        _key: "variety-price",
        name: "Price",
        imageUrl:
          "https://drive.google.com/file/d/1SHlUEWY8acYKwNG_NGSKH-vjf_d5Q_mo/view?usp=sharing",
      },
      {
        _key: "variety-monterey",
        name: "Monterey",
        imageUrl:
          "https://drive.google.com/file/d/1r0l4mKi3j745KNbY55qCxpFt5z1IO4M9/view?usp=sharing",
      },
      {
        _key: "variety-shasta",
        name: "Shasta",
        imageUrl:
          "https://drive.google.com/file/d/15ZtSPN1aBJUlMzx5qPKRcQL914wjkLQa/view?usp=sharing",
      },
      {
        _key: "variety-peerless",
        name: "Peerless",
        imageUrl:
          "https://drive.google.com/file/d/11tlNGw2mM7ivaAUhHWu1Pozz1E89Xo60/view?usp=sharing",
      },
      {
        _key: "variety-supareil",
        name: "Supareil",
        imageUrl:
          "https://drive.google.com/file/d/1BVcyx2n--VU31YjJRLUOS_YVPuEKSH0N/view?usp=sharing",
      },
    ],
  },
  {
    _id: "product-cashews",
    title: createLocaleString("Cashew"),
    category: "cashews",
    slug: { current: "cashews" },
    order: 2,
    heroHeading: createLocaleString("Premium Cashews – W180, W240 & More"),
    introParagraphs: [
      createLocaleText(
        "Divyansh International brings you the creamiest, crunchiest cashews sourced from the finest processing centres in India and Africa."
      ),
      createLocaleText(
        "Graded for perfection, our cashews are ideal for namkeen manufacturers, sweet marts, luxury gifting and retail packs."
      ),
    ],
    listSections: [
      {
        _key: "ls-cashew-1",
        title: createLocaleString("Grades Available"),
        items: [
          createLocaleString(
            'W150 (Exceptionally Larde) - Often called "Super Giant" or "Emperor cashews"'
          ),
          createLocaleString("W180 (King Size) - The largest, most premium grade"),
          createLocaleString("W210 (Jumbo) - Popular for premium gifting"),
          createLocaleString("W240 (Standard) - Ideally balanced size and cost"),
          createLocaleString("W320 (Market Standard) - Most widely used grade"),
          createLocaleString("Splits & Pieces (LWP/SWP) - For confectionery and gravy base"),
        ],
      },
      {
        _key: "ls-cashew-2",
        title: createLocaleString("Packaging"),
        items: [
          createLocaleString("10kg / 11.34kg Tin Packs"),
          createLocaleString("Vacuum pouches for bulk freshness"),
        ],
      },
      {
        _key: "ls-cashew-3",
        title: createLocaleString("Why Choose Our Cashews?"),
        items: [
          createLocaleString("Guaranteed low moisture & high crunch"),
          createLocaleString("Whiteness intact with superior grading"),
          createLocaleString("Consistent supply throughout the season"),
          createLocaleString("Competitive bulk rates for wholesalers"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Require bulk cashews? Contact us for the best daily rates and supply continuity."
    ),
    description: createLocaleText("Premium W180, W240 & W320 Cashews for retail & wholesale."),
    heroImageUrl:
      "https://drive.google.com/file/d/1GbqwbSpHLPff4mjSIIdSi0HeehvSG0BE/view?usp=sharing",
    gallery: [],
    pricing: { currentPrice: 950, originalPrice: 1350, discount: 20 },
    specifications: {
      origin: "India, Vietnam, West Africa",
      variety: "White Wholes (WW240, WW320, WW450)",
      packaging: "Industrial Export Grade",
      shelfLife: "12 Months",
      storage: "Climate Controlled (10-15°C)",
      qualitySealed: "Oxygen Scavenging / Nitrogen Flush (Standard)",
      logistics: "FOB, CIF, CFR, DDP",
      standardDimensions: {
        cartonSize: "22.68 KG (2 x 11.34 KG Units)",
        cartonType: "Double-Wall Reinforced Export Corrugated",
        bagSize: "11.34 KG (25 lbs) per Unit",
        bagType: "High-Barrier Co-extruded Vacuum Pouches",
        shelfLife: "12 Months",
        storage: "Isolate from Strong Odors & High Moisture",
      },
    },
    applications: [
      "Gourmet snack processing and roasting lines",
      "Institutional catering and high-end hospitality",
      "Traditional confectionery and luxury gifting",
      "Nut-based culinary pastes and industrial ingredients",
    ],
  },
  {
    _id: "product-walnuts",
    title: createLocaleString("Walnuts"),
    category: "walnuts",
    slug: { current: "walnuts" },
    order: 3,
    heroHeading: createLocaleString(
      "Trusted Bulk Walnut Importer & Kashmiri Walnut Distributor in India"
    ),
    introParagraphs: [
      createLocaleText(
        "Divyansh International supplies premium-grade walnuts in quantity, sourced from the best farms across the globe."
      ),
      createLocaleText(
        "As a long-standing importer and distributor, we cater to retail buyers, quality traders, dry fruit packers, food manufacturers and customers across India."
      ),
    ],
    listSections: [
      {
        _key: "ls-5",
        title: createLocaleString("Grades & Formats"),
        items: [
          createLocaleString("Whole Walnuts"),
          createLocaleString("Walnut Kernels – Halves / Quarters / Chips"),
        ],
      },
      {
        _key: "ls-6",
        title: createLocaleString("Packaging Options"),
        items: [createLocaleString("Bulk and retail packages available")],
      },
      {
        _key: "ls-7",
        title: createLocaleString("Why Partner with Us for Walnuts?"),
        items: [
          createLocaleString("Multiple origins under one roof"),
          createLocaleString("Consistent bulk availability"),
          createLocaleString("Stringent sizing, grading & moisture control"),
          createLocaleString("Dedicated pricing and quick dispatch"),
          createLocaleString("Ideal for resellers, repackers and professional tenders"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Looking for quality walnut rates? Get in touch for price lists, samples and annual supply contracts."
    ),
    description: createLocaleText(
      "Bulk walnuts and kernels with stringent grading for retailers, food processors and exporters."
    ),
    heroImageUrl:
      "https://drive.google.com/file/d/18R_RdM1dwkEXXtthxtbCNYpbQdhkSdiN/view?usp=sharing",
    gallery: [
      {
        _key: "walnut-gallery-1",
        imageUrl:
          "https://drive.google.com/file/d/1v5xPioa29d-rpNr2DeiE9gUyPOMQBGDq/view?usp=sharing",
        alt: "Premium Walnut Kernels",
      },
      {
        _key: "walnut-gallery-2",
        imageUrl:
          "https://drive.google.com/file/d/1Sp0q-DV2cPzRyz1h77_dX--y3BCORZdB/view?usp=sharing",
        alt: "Walnut Halves Close-up",
      },
      {
        _key: "walnut-gallery-3",
        imageUrl:
          "https://drive.google.com/file/d/1ZNj4WOkcN4xXFZiO-uluEgq_hs2baokB/view?usp=sharing",
        alt: "Kashmiri Walnuts",
      },
      {
        _key: "walnut-gallery-4",
        imageUrl:
          "https://drive.google.com/file/d/14mbMrIBSwVZf8dN845YmkPI_mwfVSSmd/view?usp=sharing",
        alt: "Walnut Processing Facility",
      },
      {
        _key: "walnut-gallery-5",
        imageUrl:
          "https://drive.google.com/file/d/1KYs1uoky1FUzmm862PAOS21S2WoHY-en/view?usp=sharing",
        alt: "Walnut Bulk Packaging",
      },
    ],
    pricing: { currentPrice: 899, originalPrice: 1199, discount: 25 },
    specifications: {
      origin: "Chile, California (USA), Kashmir (India)",
      variety: "Extra Light Halves (ELH) / Light Halves & Quarters (LHQ)",
      packaging: "Food-Grade B2B Bulk",
      shelfLife: "12 Months (Cold Chain)",
      storage: "Specialized Cold Storage (2-5°C / <60% RH)",
      qualitySealed: "Precision Vacuum / Inert Gas Flush",
      logistics: "FOB, CIF, CFR",
      standardDimensions: {
        cartonSize: "10 KG Net / 11.34 KG (25 lbs)",
        cartonType: "Corrugated Cardboard with Poly-Liner",
        bagSize: "5 KG / 10 KG Units",
        bagType: "High-Shield Vacuum / MAP Bags",
        shelfLife: "12 Months",
        storage: "Refrigeration Mandatory for Lipid Stability",
      },
    },
    applications: [
      "Health-focused retail and nutraceutical production",
      "Industrial bakery and breakfast cereal inclusion",
      "Direct consumption and premium snack mixes",
      "Plant-forward ingredient manufacturing",
    ],
  },
  {
    _id: "product-pistachios",
    title: createLocaleString("Pistachios"),
    category: "pistachio",
    slug: { current: "pistachios" },
    order: 4,
    heroHeading: createLocaleString(
      "Bulk Pistachio Importer & Premium Pistachio Distributor in India"
    ),
    introParagraphs: [
      createLocaleText(
        "Divyansh International supplies high-quality pistachios catering to India's requirements in retail, hospitality, quality, everyday needs and gifting segments."
      ),
      createLocaleText(
        "Our pistachios are carefully sourced, size-graded and packed to meet the standards of retail chains, gourmet brands and food service operators across the country."
      ),
    ],
    listSections: [
      {
        _key: "ls-8",
        title: createLocaleString("Varieties Available"),
        items: [
          createLocaleString(
            "American Pistachios (California) – Bold, mildly sweet flavour, preferred for retail & export buyers"
          ),
          createLocaleString(
            "Iranian Pistachios – Naturally rich flavour & deeper green kernel, ideal for premium gifting & gourmet segment"
          ),
        ],
      },

      {
        _key: "ls-10",
        title: createLocaleString("Packaging Formats"),
        items: [
          createLocaleString("10kg & 20kg imported cartons"),
          createLocaleString("5kg vacuum packs for professional use"),
          createLocaleString("Custom packing for gifting / private label available"),
        ],
      },
      {
        _key: "ls-11",
        title: createLocaleString("Why Source Pistachios from Us?"),
        items: [
          createLocaleString("Direct importers with year-round availability"),
          createLocaleString("Multiple origins for price & flavour flexibility"),
          createLocaleString("Size-graded, hygienically packed, ready for retail or bulk use"),
          createLocaleString(
            "Strong supply chain across Punjab, Delhi-NCR, Mumbai, Bangalore & export markets"
          ),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Need premium pistachio pricing & samples for purchase? Contact us for today’s quality quotes."
    ),
    description: createLocaleText(
      "Premium pistachios graded for retail, hospitality and gifting programs."
    ),
    heroImageUrl:
      "https://drive.google.com/file/d/1eVBdpjGBzhtIrlf-w5ZEiuosiibg5F3M/view?usp=sharing",
    gallery: [
      {
        _key: "pista-gallery-1",
        imageUrl:
          "https://drive.google.com/file/d/1Iq5UeEXW5T1zgUyv1yQ5wjbeuajTuJzs/view?usp=sharing",
        alt: "Premium Pistachios In-Shell",
      },
      {
        _key: "pista-gallery-2",
        imageUrl:
          "https://drive.google.com/file/d/1M5I_l2xQK64w_UyAZ2TD4bqfbuVMzB5i/view?usp=sharing",
        alt: "California Pistachios",
      },
      {
        _key: "pista-gallery-3",
        imageUrl:
          "https://drive.google.com/file/d/1M3Uxer7ZQGINjfGppUoPxCvuuMZeqxT1/view?usp=sharing",
        alt: "Iranian Premium Pistachios",
      },
      {
        _key: "pista-gallery-4",
        imageUrl:
          "https://drive.google.com/file/d/1EjYAbM9E2KST20cYP2CoTzQUfA9oavoh/view?usp=sharing",
        alt: "Pistachio Packaging",
      },
      {
        _key: "pista-gallery-5",
        imageUrl:
          "https://drive.google.com/file/d/1WQRuw5EydvXj3X395hHoovh8nguomUYg/view?usp=sharing",
        alt: "Roasted Pistachios",
      },
    ],
    pricing: { currentPrice: 8999, originalPrice: 10499, discount: 14 },
    specifications: {
      origin: "Iran, California (USA), Turkey",
      variety: "In-Shell (Akbari/Fandoghi) & Shelled Kernels",
      packaging: "Bulk Industrial Packs",
      shelfLife: "12 Months",
      storage: "Cool & Dry (4-7°C Optimal)",
      qualitySealed: "Aflatoxin Tested / Nitrogen Flush Available",
      logistics: "FOB, CIF, CFR",
      standardDimensions: {
        cartonSize: "10 KG Net Weight",
        cartonType: "Heavy-Duty Industrial Grade Carton",
        bagSize: "25 KG Bulk Sacks",
        bagType: "Woven PP with LDPE Inner Liner",
        shelfLife: "12 Months",
        storage: "Pest-Controlled / Airflow-Optimized Facility",
      },
    },
    applications: [
      "Premium gifting and hospitality segments",
      "Gelato, artisanal bakery, and flavor profiling",
      "International snack food manufacturing",
      "Garnishing and decorative culinary use",
    ],
  },
  {
    _id: "product-desiccated-coconut",
    title: createLocaleString("Desiccated Coconut"),
    category: "coconut",
    slug: { current: "desiccated-coconut" },
    order: 5,
    heroHeading: createLocaleString("Bulk Desiccated Coconut & Copra Supplier – India"),
    introParagraphs: [
      createLocaleText(
        "Divyansh International offers high-grade desiccated coconut products for both industrial buyers and quality trade partners across India."
      ),
      createLocaleText(
        "Our coconut is carefully sourced, shredded, dried and graded, ensuring long shelf-life, purity and uniform texture required by bakeries, sweet manufacturers, confectioners, namkeen makers, ice-cream units and repackaging brands."
      ),
    ],
    listSections: [
      {
        _key: "ls-15",
        title: createLocaleString("Product Forms Available"),
        items: [
          createLocaleString(
            "Fine Desiccated Coconut Powder – ideal for sweets, barfi, ladoo, confectionery"
          ),
          createLocaleString(
            "Desiccated Coconut Flakes (Large Cut) – used in bakery toppings, cereal mixes & retail packs"
          ),
          createLocaleString("Copra (Edible Grade) – for pressed oil/food applications"),
        ],
      },
      {
        _key: "ls-16",
        title: createLocaleString("Packaging Formats"),
        items: [
          createLocaleString("10kg & 25kg poly-lined bags / cartons"),
          createLocaleString("Customised 1kg & 500gm private label packs for retail / export"),
        ],
      },
      {
        _key: "ls-17",
        title: createLocaleString("Why Buy from Divyansh International?"),
        items: [
          createLocaleString("Consistent high-fat, fresh stock"),
          createLocaleString("Hygienic drying & moisture-controlled packing"),
          createLocaleString("Trusted supplier to FMCG brands and quality dry fruit traders"),
          createLocaleString("Rapid delivery across Punjab, North India & pan-India"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Need desiccated coconut for industrial use or repackaging? Request our pricing & Min. Order today."
    ),
    description: createLocaleText(
      "Fine powder, flakes and copra variants for industrial, retail and private-label coconut programs."
    ),
    heroImageUrl:
      "https://drive.google.com/file/d/17hj3lf0l5P_1AU-PMYc-ce0lVZFmPXz7/view?usp=sharing",
    gallery: [],
    pricing: { currentPrice: 2499, originalPrice: 2999, discount: 17 },
    specifications: {
      origin: "India, Indonesia, Philippines",
      variety: "High Fat (Fine / Medium Grade)",
      packaging: "Bulk Industrial Supply",
      shelfLife: "12 Months",
      storage: "Cool & Dry / Humidity <50%",
      qualitySealed: "Microbiologically Tested (Salmonella-Free)",
      logistics: "FOB, CIF, CFR",
      standardDimensions: {
        cartonSize: "10 KG / 12.5 KG (Foodservice)",
        cartonType: "Standard Reinforced Industrial Carton",
        bagSize: "25 KG / 50 KG Bulk Packs",
        bagType: "Multi-wall Kraft Paper with PE Moisture Liner",
        shelfLife: "12 Months",
        storage: "Keep Away from Heat Sources to Preserve Natural Oils",
      },
    },
    applications: [
      "Large-scale commercial bakery and biscuit production",
      "Traditional dessert and ethnic food manufacturing",
      "Instant food pre-mixes and protein bars",
      "Industrial-scale confectionery and ice cream base",
    ],
  },
  {
    _id: "product-raisins",
    title: createLocaleString("Raisins (Kishmish)"),
    category: "raisins",
    slug: { current: "raisins" },
    order: 6,
    heroHeading: createLocaleString("Bulk Kishmish Supplier – India"),
    introParagraphs: [
      createLocaleText(
        "Divyansh International has established itself as a reliable importer and quality supplier of raisins (kishmish) for buyers across India."
      ),
      createLocaleText(
        "We source premium-quality harvests to offer multiple grades, price points and flavour profiles under one roof. Our raisins are sorted, cleaned and packed hygienically – making them ideal for packagers, bakeries, mithai/confectionery units, retailers and professional purchase."
      ),
    ],
    listSections: [
      {
        _key: "ls-12",
        title: createLocaleString("Raisin Types Available"),
        items: [
          createLocaleString(
            "Golden Raisins – Premium quality – preferred for retail & export packs"
          ),
          createLocaleString(
            "Indian Raisins – Green, Black, Golden (Sunde Khani / long raisins, round raisins) – popular for traditional retail, gifting & FMCG use"
          ),
          createLocaleString(
            "Kandhari Raisins – Green, Black, Golden (Mannaca / Abjosh) – premium choice for retail, export and high-value consumption"
          ),
        ],
      },
      {
        _key: "ls-13",
        title: createLocaleString("Packaging Options"),
        items: [
          createLocaleString("5kg & 10kg vacuum-packed bags"),
          createLocaleString("15kg & 25kg cartons"),
        ],
      },
      {
        _key: "ls-14",
        title: createLocaleString("Why Choose Us for Raisins?"),
        items: [
          createLocaleString("Origin: Indian and imported grades"),
          createLocaleString("Hygienic processing and grading"),
          createLocaleString("Competitive pricing across grades"),
          createLocaleString("On-time delivery across Punjab, North India & pan-India"),
          createLocaleString("Trusted supplier to qualityrs, hospitality, retail & exporters"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Looking to buy raisins in quantity? Enquire now about quality price lists and yearly supply contracts."
    ),
    description: createLocaleText(
      "Golden, Indian and Kandhari raisins processed hygienically for quality and customer needs."
    ),
    heroImageUrl:
      "https://drive.google.com/file/d/1o-ar-PMQBA9xsJktq57baDqE1rQBWrrB/view?usp=sharing",
    gallery: [],
    pricing: { currentPrice: 899, originalPrice: 1199, discount: 25 },
    specifications: {
      origin: "India, Afghanistan, Turkey",
      variety: "Green Long, Golden (A-Grade), Malayar",
      packaging: "Export Standard Bulk",
      shelfLife: "12 Months",
      storage: "Cool Ambient (10-15°C / Well Ventilated)",
      qualitySealed: "Color Sorted / SO2 Compliance Certified",
      logistics: "FOB, CIF, CFR",
      standardDimensions: {
        cartonSize: "10 KG Net Weight",
        cartonType: "Corrugated Export Carton with LDPE Liner",
        bagSize: "12.5 KG / 15 KG Bulk",
        bagType: "Food-Grade Poly-Lined PP Bags",
        shelfLife: "12 Months",
        storage: "Avoid High-Humidity Zones to Prevent Sugaring",
      },
    },
    applications: [
      "Bulk ingredient for cereal and muesli production",
      "Quality-tier retail distribution and dried fruit blends",
      "Institutional baking and confectionery supply",
      "Global commodity trade and processing",
    ],
  },
];

const heroSlides = [
  {
    _id: "0",
    eyebrow: "Since 1999",
    badge: "Leading global importer",
    headline: "Premium Dry Fruits: Nature's Finest Harvest",
    paragraphs: [
      "We source premium almonds and dry fruits directly from reputed global orchards, ensuring every kernel meets strict ISO & FSSAI safety standards.",
      "With a robust international network and deep market expertise, we deliver consistent, certified quality to wholesalers and retailers across India.",
    ],
    primaryCta: { label: "Explore Our Collection", target: "/products" },
    secondaryCta: { label: "Contact Us", target: "contact" },
    videoUrl: "https://youtu.be/aTOTCFNhlq8?si=9ezhh8xEC38NPkJs",
    posterUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?w=1920&q=80",
    posterImageUrl: "",
  },
];

const timeline = [
  {
    _id: "1",
    year: 1900,
    title: "The Beginning – Gujranwala",
    description:
      "A well-established quality spices business thrived in Gujranwala, Punjab (then part of undivided India, now Pakistan).",
    imageUrl: "https://drive.google.com/file/d/1tUoOzsm3DoYFuw9PIpQzvb9K5Th1Cctq/view?usp=sharing",
  },
  {
    _id: "2",
    year: 1947,
    title: "Partition & New Beginnings",
    description:
      "Following Partition, the family migrated to Ludhiana, Punjab—empty-handed but rich in experience and determination. At just 11 years of age, Mr. Som Nath Sethi marked a new beginning in India by starting a quality and retail grocery store.",
    imageUrl: "https://drive.google.com/file/d/1tZr_OnkUwGfghxcFJaRzb6fr64dc8zd3/view?usp=sharing",
  },
  {
    _id: "3",
    year: 1969,
    title: "Hospitality Expansion",
    description:
      "Mr. Raman Sethi expanded operations into the hospitality (Hotel, Restaurant & Catering) segment, strengthening the business's professional footprint.",
    imageUrl: "https://drive.google.com/file/d/1FAiADYUkYaQxMlIMo0z8CWi5KKhRKYQS/view?usp=sharing",
  },
  {
    _id: "4",
    year: 1984,
    title: "Third Generation Joins",
    description:
      "During the turbulent years of riots and emergency in Punjab, Mr. Sanjeev Sethi joined the business in his teenage years, dedicating himself to serving the people of Punjab—an involvement that became lifelong.",
    imageUrl: "https://drive.google.com/file/d/1kk45Id4ph8WjqEzKIXYcKiixpC0apbZ1/view?usp=sharing",
  },
  {
    _id: "5",
    year: 1999,
    title: "Divyansh International – California Almonds",
    description:
      "The family branched out internationally with the launch of Divyansh International, beginning imports of California Almonds.",
    imageUrl: "https://drive.google.com/file/d/11kzSvTQo3ckqT4qiCwfAkfkP_PUS9l3x/view?usp=sharing",
  },
  {
    _id: "6",
    year: 2015,
    title: "Portfolio Expansion – Walnuts",
    description:
      "Mr. Divyansh Sethi, with a next-generation approach, expanded the portfolio to include Walnuts, scaling operations with a strong foundation in finance and marketing.",
    imageUrl: "https://drive.google.com/file/d/1pVDGhsdO3om9LCkgWedrxPeDUqxC1XPJ/view?usp=sharing",
  },
  {
    _id: "7",
    year: 2021,
    title: "Zonaar Global – International Trade",
    description:
      "Divyansh International further expanded its global footprint by initiating international trade facilitation and brokerage under the name Zonaar Global, connecting markets and partners across borders with trust, expertise, and efficiency.",
    imageUrl: "https://drive.google.com/file/d/1osoAeltGXeS0UzETc9l9VHnbVRG2Pz1V/view?usp=sharing",
  },
  {
    _id: "8",
    year: 2022,
    title: "State-of-the-Art Facility – Mullapur",
    description:
      "Operations expanded to a state-of-the-art facility in Mullapur, Ludhiana—ISO & FSSAI certified—marking a major infrastructural milestone and reinforcing the group's commitment to quality and compliance.",
    imageUrl: "https://drive.google.com/file/d/1evN1Leaxmslb2jOQRlTCRgKK6VATHysQ/view?usp=sharing",
  },
  {
    _id: "9",
    year: 2023,
    title: "The Badam Factory – Heritage Retail",
    description:
      "Launched a heritage retail outlet, 'The Badam Factory', at the original workplace—reviving the name affectionately given by the people.",
    imageUrl: "https://drive.google.com/file/d/1K_kRTkrzhFULIVSWLkMWVuR4cV-tzIBB/view?usp=sharing",
  },
  {
    _id: "10",
    year: 2025,
    title: "The Betternut Co. – Modern Conscious Living",
    description:
      "Launch of The Betternut Co., ushering the legacy into a modern, conscious-living brand—focused on mindfulness and well-being through food.",
    imageUrl: "https://drive.google.com/file/d/1csHJ9I-a-7CUT6XjWazx9GYTMJVvcFPn/view?usp=sharing",
  },
];

const teamMembers = [
  {
    _id: "1",
    name: "Rajesh Kumar",
    role: "Founder & Chairman",
    imageUrl: "",
  },
  {
    _id: "2",
    name: "Amit Singh",
    role: "Managing Director",
    imageUrl: "",
  },
  {
    _id: "3",
    name: "Priya Sharma",
    role: "Head of Operations",
    imageUrl: "",
  },
];

const capabilities = [
  {
    _id: "1",
    title: "Global Sourcing Network",
    description:
      "Direct partnerships with growers across 15+ countries ensure year-round availability and competitive pricing for customers.",
    metric: "15+ Origins",
    order: 1,
  },
  {
    _id: "2",
    title: "ISO & FSSAI Certified",
    description:
      "State-of-the-art facility with daily cleaning, weighing, and custom grading. Fully compliant with ISO 22000:2018 & FSSAI standards.",
    metric: "ISO 22000 & FSSAI",
    order: 2,
  },
  {
    _id: "3",
    title: "Flexible Packaging Solutions",
    description:
      "From bulk cartons to vacuum packs and private label formats, we adapt to your distribution requirements.",
    metric: "Custom Packs",
    order: 3,
  },
  {
    _id: "4",
    title: "Pan-India Distribution",
    description:
      "Fast delivery across Punjab, North India, and nationwide with dedicated logistics for retail and customers.",
    metric: "Pan-India",
    order: 4,
  },
  {
    _id: "5",
    title: "Quality Assurance",
    description:
      "Rigorous testing and quality control at every stage from sourcing to packaging ensures consistent premium quality.",
    metric: "99% QA",
    order: 5,
  },
  {
    _id: "6",
    title: "Industry Experience",
    description:
      "Over 25 years of experience serving qualityrs, retail, hospitality, and customers.",
    metric: "25+ Years",
    order: 6,
  },
];

const brands = [
  {
    _id: "sethi-gold",
    name: "Sethi Gold",
    brandCopy:
      "Sethi Gold represents our commitment to premium quality and excellence. This flagship brand embodies the legacy of Mr. Som Nath Sethi, offering the finest dry fruits to discerning customers.",
    productSKUs: ["SG-ALM-001", "SG-ALM-002", "SG-WAL-001"],
    distributionContacts: [
      {
        _key: "dc-1",
        name: "Distribution Team",
        email: "distribution@sethigold.com",
        phone: "+91-XXX-XXX-XXXX",
      },
    ],
    heroImageUrl: "",
    order: 1,
  },
  {
    _id: "sethi-mawa",
    name: "Sethi Mawa",
    brandCopy:
      "Sethi Mawa brings traditional flavors to modern markets. A trusted name in quality food products.",
    productSKUs: ["SM-001", "SM-002"],
    heroImageUrl: "",
    order: 2,
  },
  {
    _id: "butternut",
    name: "Butternut",
    brandCopy:
      "Butternut offers a wide range of premium dry fruits and nuts for everyday consumption.",
    productSKUs: ["BN-001", "BN-002"],
    heroImageUrl: "",
    order: 3,
  },
];

const certificates = [
  {
    _id: "1",
    name: "ISO 22000",
    label: "2015",
    order: 1,
    imageUrl: "https://drive.google.com/file/d/1fdUPYZ5KAjjrHdErgzFF2lEAYiHz_vPe/view?usp=sharing",
  },
  {
    _id: "2",
    name: "HACCP",
    label: "Certified",
    order: 2,
    imageUrl: "https://drive.google.com/file/d/1JXw2dn8vqrgzhLO3tyNE6nKblrx5m4R3/view?usp=sharing",
  },
  {
    _id: "3",
    name: "FSSAI",
    label: "Licensed",
    order: 3,
    imageUrl: "https://drive.google.com/file/d/1Mxmbj3FSRt8CQIcNTiyQn1uYOoVAlRAe/view?usp=sharing",
  },
  {
    _id: "4",
    name: "ISO 9001",
    label: "2015",
    order: 4,
    imageUrl: "https://drive.google.com/file/d/12_2U6dQVla35zWcBSrB4BxYs2zep4fLx/view?usp=sharing",
  },
];

const testimonials = [
  {
    _id: "0",
    quote:
      "Divyansh delivers the responsiveness and QA rigor we expect from leading processors. RFQs, lab updates and dispatch milestones arrive without chasing.",
    author: "Head Of Purchase",
    role: "Modern Trade Retailer",
  },
  {
    _id: "1",
    quote:
      "We've been sourcing California almonds from Divyansh for 8 years now. Consistent sizing, moisture levels within spec, and their documentation is always export-ready.",
    author: "Vikram Mehta",
    role: "Export Manager, SpiceTrail Foods",
  },
  {
    _id: "2",
    quote:
      "Their walnut kernels meet our stringent bakery standards. The light halves grade has transformed our premium cookie line. Reliable partner for seasonal demand spikes.",
    author: "Priya Krishnan",
    role: "Procurement Lead, Artisan Bakers Co.",
  },
  {
    _id: "3",
    quote:
      "From inquiry to delivery, Divyansh treats us like partners not just customers. Their team helped us navigate FSSAI compliance for our new product line launch.",
    author: "Rajesh Agarwal",
    role: "Director, NutriSnacks Private Ltd",
  },
  {
    _id: "4",
    quote:
      "The Kandhari raisins we source for our mithai production are consistently sweet with the perfect texture. They understand the traditional sweets industry requirements.",
    author: "Suresh Halwai",
    role: "Owner, Shree Ganesh Sweets",
  },
  {
    _id: "5",
    quote:
      "Fast turnaround on custom grading requests sets them apart. When we needed a specific almond size for our chocolate line, they delivered within the week.",
    author: "Anita Deshmukh",
    role: "Supply Chain Head, ChocoLux India",
  },
];

const communityData = {
  _id: "community",
  _type: "community",
  // =============================================================================
  // POSTER SLIDER SECTION
  // =============================================================================
  posterSliderSection: {
    enabled: true,
    autoPlayInterval: 6000,
    posters: [
      {
        _key: "slider-1",
        _type: "contentBanner",
        eyebrow: "BUILDING TOGETHER",
        title: "Community",
        highlight: "A business does not grow in isolation.",
        description:
          "Every milestone we achieve carries a responsibility towards the people and ecosystems that make our growth possible. Our commitment begins with employees and extends to:",
        features: [
          "Employee Well-being",
          "Family Support",
          "Education Support",
          "Industry Collaboration",
          "Environmental Respect",
        ],
        layout: "text-only",
        theme: "dark",
      },
      {
        _key: "slider-2",
        _type: "contentBanner",
        eyebrow: "Growing With Purpose",
        title: "Growing With Purpose",
        highlight:
          "Community responsibility is not a separate chapter from business, it is part of the same story.",
        description:
          "We build long-term value for our people, partners, and communities through dedicated initiatives:",
        features: [
          "Supporting Education",
          "Empowering Women",
          "Caring for Families",
          "Industry Dialogue",
          "Sustainability Investments",
        ],
        layout: "text-only",
        theme: "dark",
      },
    ],
  },

  header: undefined,
  closingMessage: undefined,
  corePhilosophy: undefined,
  educationSection: {
    icon: "🎓",
    title: "Giving Back Through Education and Social Participation",
    images: [
      "https://drive.google.com/file/d/1cxg9wcr_ppBehgzmIvTAoX4S5M2HYBWo/view?usp=sharing",
      "https://drive.google.com/file/d/11klFEWrkGxOX4AefBLcYmRufEqlct1fV/view?usp=sharing",
      "https://drive.google.com/file/d/1e2gCan1kk507BfeBSDS6QphlcuoNbx9Y/view?usp=sharing",
      "https://drive.google.com/file/d/1esJEybubAQM54ahF7uZv2ZTldoSlzQZ-/view?usp=sharing",
      "https://drive.google.com/file/d/1-HY5ypFuiAVOKTYPkZTXBbCejwfwgqdO/view?usp=sharing",
      "https://drive.google.com/file/d/10SR7TJ7mDma__XkcF14yDTeRzPwhurn2/view?usp=sharing",
      "https://drive.google.com/file/d/1YcIPI3EYMRoDCjzLuA08jnc2oet7izjY/view?usp=sharing",
    ],
    paragraphs: [
      "As part of its broader commitment to social responsibility, Divyansh International actively associates with government schools that serve underprivileged communities. The focus is on consistent involvement rather than one-time support.",
      "The organisation contributes wherever there is a genuine need — participating in initiatives, addressing essential requirements, and supporting learning environments through ongoing engagement. These efforts align with the company’s belief that education is a long-term investment in stronger communities.",
    ],
    quote: "Education is a long-term investment in stronger communities.",
  },
  womenEmpowerment: {
    icon: "👩‍💼",
    title: "Women at the Core of Our Workforce",
    imageUrl: "https://drive.google.com/file/d/1404P1Ew9hqXXc0rNOMCHyYiz_k2ru6DO/view?usp=sharing",
    paragraphs: [
      "People are central to everything at Divyansh International, and women form a vital part of that foundation.",
      "The organisation maintains close, personal relationships with its women employees, creating a work environment that prioritises trust, respect, and continuity. Beyond providing employment, Divyansh International has nurtured a supportive community where women share experiences, encourage one another, and build confidence together.",
      "A dedicated digital platform allows women employees to voice their journeys and motivate each other to step into the workforce and sustain their careers. This initiative reflects the company’s commitment to women empowerment and inclusive growth.",
    ],
  },
  childcareSection: {
    icon: "🧸",
    title: "Supporting Families Through Childcare and Learning",
    imageUrl: "https://drive.google.com/file/d/1G3cTh91OvKgnjS6kolXjxzU7MCy1ij72/view?usp=sharing",
    paragraphs: [
      "Understanding the realities faced by working mothers, Divyansh International has created a dedicated activity and learning centre for employees’ children.",
      "This space includes supervised play areas for younger children and academic guidance through an assigned tutor. By providing this support, the organisation enables women employees to work with peace of mind while ensuring their children receive care and learning assistance in a safe environment.",
    ],
    highlight:
      "Such initiatives reinforce Divyansh International’s employee-centric culture and commitment to work-life balance.",
  },
  industryCollaboration: {
    icon: "🤝",
    title: "Building Stronger Industry Communities",
    imageUrl: "https://drive.google.com/file/d/167EE8n_O4cFkKavCGavLPKZvVj3D7Wu-/view?usp=sharing",
    paragraphs: [
      "Divyansh International actively participates in industry-level collaboration through its association with a national trade council representing the nuts and dry fruits sector.",
      "By engaging in discussions, trade roadshows, and collective initiatives, the organisation contributes to addressing common industry challenges and promoting responsible trade practices. This involvement reflects the company’s belief in shared progress and ethical industry growth.",
    ],
  },
  environmentalSection: {
    icon: "🌱",
    title: "Environmental Responsibility as a Way of Operating",
    imageUrl: "https://drive.google.com/file/d/1u6CaCSbN7feQ2oQZJIe9fZECT0-gX0ih/view?usp=sharing",
    introText: "Sustainability is integrated into the daily operations at Divyansh International.",
    initiatives: [
      {
        _key: "solar",
        icon: "☀️",
        text: "Invested in solar energy systems to reduce environmental footprint",
      },
      {
        _key: "water",
        icon: "💧",
        text: "Implemented rainwater harvesting solutions to promote responsible water usage",
      },
      {
        _key: "housing",
        icon: "🏠",
        text: "Residential accommodation provided close to the workplace to reduce commute-related strain",
      },
      {
        _key: "school",
        icon: "🏫",
        text: "Partnerships with nearby schools to support education of employees’ children",
      },
    ],
  },

  employeeStories: {
    eyebrow: "OUR TEAM",
    title: "Employee Stories",
    note: "Hear directly from the people who make it happen.",
    videos: [
      {
        _key: "emptest1",
        title: "Employee Experience",
        description: "Shared journey at Divyansh International",
        videoUrl: "https://youtu.be/MXmxsiLI1cI?si=LD3Yko8xEJt_71b_",
      },
      {
        _key: "emptest2",
        title: "Working Culture",
        description: "Inside our collaborative environment",
        videoUrl: "https://youtu.be/nS38lUmTEVs?si=MoWxeEwLKKlVT3s-",
      },
      {
        _key: "emptest3",
        title: "Growth Opportunities",
        description: "Professional development stories",
        videoUrl: "https://youtu.be/IHjzmuLm_3o?si=S03BtxAhckJ4TJSR",
      },
      {
        _key: "emptest4",
        title: "Team Spirit",
        description: "Building success together",
        videoUrl: "https://youtu.be/s0Nhc1kj5K8?si=0wLyh3rezdTseCw9",
      },
      {
        _key: "emptest5",
        title: "Daily Operations",
        description: "A day in the life of our team",
        videoUrl: "https://youtu.be/h3n9kGDcdkY?si=6cqqai91AbY9sB_0",
      },
    ],
  },
  tradeEventsSection: {
    title: "Trade Events & Exhibitions",
    subtitle: "Meet us at leading industry events across India",
  },
  tradeEvents: [
    {
      _key: "gulfood2026",
      name: "Gulfood 2026",
      date: "2026-01-26 to 2026-01-30",
      location: "Dubai World Trade Centre & Dubai Exhibition Centre (Expo City)",
      description:
        "Participating in the world's largest annual food and beverage trade exhibition. For 2026, India is the official 'Partner Country', offering unprecedented networking opportunities.",
      imageUrl:
        "https://drive.google.com/file/d/1BNcGnosEwCgrhWwdL45wQ4_Pl9Zvitve/view?usp=sharing",
    },
    {
      _key: "aahar2026",
      name: "AAHAR 2026 - International Food & Hospitality Fair",
      date: "2026-03-10 to 2026-03-14",
      location: "Bharat Mandapam (Pragati Maidan), New Delhi, India",
      description:
        "The 40th edition of India's flagship B2B event. Showcasing our premium product range and connecting with global leaders in the food, processing, and hospitality sectors.",
      imageUrl:
        "https://drive.google.com/file/d/1s9CVS_gAmfoN7mRXRd8_eEmuM2BYEsP7/view?usp=sharing",
    },
    {
      _key: "mewandiai2026",
      name: "Mewa India 2026",
      date: "2026-01-23 to 2026-01-25",
      location: "Yashobhoomi (IICC), Dwarka, New Delhi",
      description:
        "Engaging with the global nuts and dry fruits industry to present our heritage, quality standards, and extensive collection at India's premier B2B nut trade platform.",
      imageUrl:
        "https://drive.google.com/file/d/1OqlXmpUYcKeXYL4jtOPXDAwwagW3-Zbf/view?usp=sharing",
    },
  ],
  csrInitiatives: [
    {
      _key: "farmer",
      title: "Farmer Welfare Program",
      description:
        "Supporting almond and walnut farmers with fair pricing, training on sustainable practices, and direct purchase partnerships.",
    },
    {
      _key: "employment",
      title: "Local Employment",
      description:
        "Creating employment opportunities in Ludhiana and surrounding areas with focus on skill development and inclusive hiring.",
    },
    {
      _key: "safety",
      title: "Food Safety Education",
      description:
        "Conducting workshops on food safety standards and quality management for small-scale processors and traders.",
    },
  ],
};

const processSteps = [
  {
    _id: "process-1",
    title: "Farm Tie-Ups",
    detail: "Direct global sourcing. Premium quality starts here.",
    order: 1,
    icon: "farm",
  },
  {
    _id: "process-2",
    title: "Shelling",
    detail: "State-of-the-art shelling preserves freshness.",
    order: 2,
    icon: "shelling",
  },
  {
    _id: "process-3",
    title: "Sorting",
    detail: "Optical sorting for perfect size and grade.",
    order: 3,
    icon: "sorting",
  },
  {
    _id: "process-4",
    title: "Quality Checks",
    detail: "Multi-stage lab and visual quality checks.",
    order: 4,
    icon: "quality",
  },
  {
    _id: "process-5",
    title: "Packing",
    detail: "Hygienic, vacuum-sealed packaging.",
    order: 5,
    icon: "packing",
  },
];

const sustainabilityPillars = [
  {
    _id: "1",
    title: "Farmer Partnerships",
    detail:
      "Fair pricing and long-term contracts with growers. Training programs on sustainable farming practices and quality standards.",
    order: 1,
  },
  {
    _id: "2",
    title: "Resource Efficiency",
    detail:
      "Water conservation in processing, energy-efficient machinery, and waste reduction initiatives across our facility.",
    order: 2,
  },
  {
    _id: "3",
    title: "Community Development",
    detail:
      "Local employment generation, skill development programs, and support for education initiatives in Ludhiana region.",
    order: 3,
  },
  {
    _id: "4",
    title: "Responsible Sourcing",
    detail:
      "Traceability from farm to pack. Ethical sourcing practices and compliance with international sustainability standards.",
    order: 4,
  },
];

const quoteData = {
  _id: "quote",
  _type: "quote",
  quote:
    "Quality is not an act, it is a habit. At Divyansh International, we've made excellence our standard for over 25 years.",
  author: "Divyansh International",
  linkText: "Discover Our Story",
  linkUrl: "/about",
};

const ctaData = {
  _id: "cta",
  _type: "cta",
  pricing: {
    subtitle: "Get quality Rates",
    title: "Request pricing",
    description:
      "Share your requirements and receive competitive quality quotes for your professional or purchase needs.",
    buttonText: "Contact Us",
    emailPlaceholder: "Enter your business email",
  },
  backgroundImageUrl:
    "https://drive.google.com/file/d/1y1vzbs-XLG92z37EPKgYrVlMtE_2WMiS/view?usp=drive_link",
};

const testimonialsSectionData = {
  _id: "testimonialsSection",
  _type: "testimonialsSection",
  eyebrow: "Client Testimonials",
  title: "Trusted by Leading Businesses",
  droneSection: {
    eyebrow: "Behind the Scenes",
    title: "Our Facility",
    placeholderText: "Aerial view of our processing facility",
    videoUrl: "",
    videos: [
      {
        _key: "facility-overview",
        title: "Facility Overview",
        description: "Aerial view of our ISO-certified processing facility in Mullapur, Ludhiana",
        videoUrl: "https://youtu.be/0ZD8ukKe7zU?si=zu1lLx2Tdmvs9qNd",
      },
      {
        _key: "quality-control",
        title: "Quality Control",
        description: "Our rigorous quality assurance and testing processes",
        videoUrl: "",
      },
      {
        _key: "packaging-line",
        title: "Packaging Excellence",
        description: "State-of-the-art packaging and labeling systems",
        videoUrl: "",
      },
      {
        _key: "storage-facility",
        title: "Storage Facility",
        description: "Temperature-controlled storage maintaining optimal conditions",
        videoUrl: "",
      },
    ],
    highlights: [
      "ISO 22000 certified processing unit",
      "10,000+ sq ft temperature-controlled storage",
      "Daily processing capacity: 20 MT",
      "Serving 1000+ clients across India",
    ],
    note: "Virtual tour coming soon",
  },
  backgroundImageUrl:
    "https://drive.google.com/file/d/11bEMKk5NZ7XU93UXCs_0RjAgDTbgfpTE/view?usp=sharing",
};

const values = [
  {
    _id: "1",
    title: "Quality First",
    description:
      "Uncompromising standards in sourcing, processing, and delivery. Every batch meets our rigorous quality benchmarks.",
    icon: "⭐",
    order: 1,
  },
  {
    _id: "2",
    title: "Transparency",
    description:
      "Clear communication, honest pricing, and complete traceability from farm to your facility.",
    icon: "🔍",
    order: 2,
  },
  {
    _id: "3",
    title: "Reliability",
    description:
      "Consistent supply, on-time delivery, and dependable partnerships built over 25+ years of trust.",
    icon: "🤝",
    order: 3,
  },
  {
    _id: "4",
    title: "Innovation",
    description:
      "Continuous improvement in processing technology, packaging solutions, and customer service.",
    icon: "💡",
    order: 4,
  },
];

const aboutData = {
  _id: "about",
  _type: "about",

  // =============================================================================
  // POSTER SLIDER SECTION
  // =============================================================================
  posterSliderSection: {
    enabled: true,
    autoPlayInterval: 15000,
    posters: [
      {
        _key: "poster-memory",
        _type: "contentBanner",
        eyebrow: "ABOUT US",
        title: "A Memory That Defines Us",
        highlight: "",
        paragraphs: [
          "There's a memory that still defines the brand today. Children who accompanied their parents to the factory were always offered a piece of anjeer. A small, thoughtful gesture that quietly reflected what the business stood for: care beyond the transaction.",
          "That spirit continues to shape how Divyansh International works with customers, partners, and suppliers.",
        ],
        layout: "text-only",
        theme: "dark",
      },
      {
        _key: "poster-1",
        _type: "contentBanner",
        eyebrow: "RELIABLE INGREDIENT PARTNERS",
        title: "When you work with us, it isn't a deal. It isn't a gig.",
        highlight: "It's a partnership.",
        description: "Chosen by food manufacturers & bulk buyers.",
        features: [
          "UNIFORM SIZE • READY TO PACK",
          "CONSISTENT AVAILABILITY",
          "PREMIUM QUALITY • EXPORT STANDARDS",
        ],
        layout: "right-image",
        imageUrl:
          "https://drive.google.com/file/d/1lmKKKIt5gJqJKKgCVDLHrP-kW1ZfSXWP/view?usp=sharing",
        theme: "dark",
      },
      {
        _key: "poster-nuts",
        _type: "contentBanner",
        eyebrow: "OUR PHILOSOPHY",
        title: "We Are All Nuts in Here! 🥜",
        highlight: "We feel happier when our clients succeed...",
        paragraphs: [
          "We love to share their joy ensuring that in this ecosystem - we are all thriving. Clients & suppliers - our partners... we believe in building relationships that go beyond transactions.",
          "Similar to how different nuts complement each other in a premium mix, we create an ecosystem where everyone flourishes together.",
        ],
        stats: [
          { value: "100%", label: "Commitment" },
          { value: "25+", label: "Years of Trust" },
          { value: "15+", label: "Global Partners" },
        ],
        layout: "text-only",
        theme: "dark",
      },
    ],
  },

  header: undefined,

  openingStory: {
    title: "Every bag of dry fruits has a beginning.",
    highlight: "Ours began long before it had a name.",
    paragraphs: [
      "The story of Divyansh International is rooted in a family legacy built on trust, quality, and relationships. Long before Divyansh International was formally established in 1999, the foundations were laid by Mr. Som Nath Sethi, whose approach to the dry fruits and nuts business was guided by service rather than scale.",
      "After moving from Gujranwala to Ludhiana, he began working with dry fruits and nuts, slowly building a reputation for honesty and consistency. Customers didn't just come for quality almonds, cashews, anjeer, and other dry fruits. They returned because they felt valued.",
    ],
  },
  anjeerStory: undefined,
  birthSection: {
    title: "The Birth of Divyansh International in 1999",
    paragraphs: [
      "As the business grew, so did the vision. Under the leadership of the second generation, with Sanjeev Sethi stepping in, the legacy evolved into a structured enterprise. In 1999, this journey took a definitive turn with the birth of Divyansh International.",
      "The focus expanded to sourcing and importing premium dry fruits and tree nuts, building strong relationships with growers and partners, and supplying consistent quality to customers across India.",
      "What changed was scale. What didn't change was the commitment to trust and long-term relationships.",
    ],
    boxTitle: "Like a Bag of Assorted Nuts",
    boxText:
      "Think of Divyansh International like a bag of assorted nuts. Each variety different, each carefully selected. Almonds, cashews, pistachios, figs, and more coming together with one common promise: quality you can rely on.",
  },
  growingSection: {
    title: "Growing as a Dry Fruits Supplier, Staying Rooted in Values",
    paragraphs: [
      "From 1999 to today, Divyansh International has grown into a reliable dry fruits and nuts importer and supplier in India, serving businesses and partners who value quality and consistency. The company continues to adapt to changing markets while staying deeply rooted in the values that shaped it decades ago.",
      "Growth here has never been rushed. It has been built steadily, through trust, transparency, and a people-first approach to business.",
    ],
  },
  philosophySection: {
    title: "We Are All Nuts in Here! 🥜",
    highlight: "We feel happier when our clients succeed...",
    paragraphs: [
      "We love to share their joy ensuring that in this ecosystem - we are all thriving. Clients & suppliers - our partners... we believe in building relationships that go beyond transactions.",
      "Similar to how different nuts complement each other in a premium mix, we create an ecosystem where everyone flourishes together.",
    ],
  },
  timelineSummaryCards: [
    {
      _key: "card1",
      title: "The Story Began",
      description: "Years ago with Mr. Som Nath Sethi's vision and values",
    },
    {
      _key: "card2",
      title: "The Brand Was Born",
      description: "In 1999 under Sanjeev Sethi's leadership",
    },
    {
      _key: "card3",
      title: "The Journey Continues",
      description: "To grow with the same values and commitment",
    },
  ],

  brandsSection: {
    title: "Our Premium Brands",
    partners: {
      title: "Premium Quality",
      names: ["Supreme", "Ridhi Sidhi", "Sethi Gold", "Sethi's Mewa"],
      description: "Premium quality solutions",
      imageUrl:
        "https://drive.google.com/file/d/15sEu65zqPJSS0gkZzu5ptftAfR-uaPLR/view?usp=sharing",
    },
    retail: {
      title: "Direct to Consumer",
      name: "The BetterNut.co",
      description: "Premium retail experience",
      imageUrl:
        "https://drive.google.com/file/d/1HwTqvNeJ9mJHioRquZuJ9gLmbMNLka0M/view?usp=sharing",
    },
  },
  productRangeSection: {
    title: "Premium Product Range",
    products: [
      "Almonds",
      "Cashew",
      "Walnuts",
      "Pistachios",
      "Desiccated Coconut",
      "Raisins (Kishmish)",
    ],
    description:
      "Available in various packaging options, quantities, and varieties to meet your specific requirements.",
  },

  ourStory: {
    eyebrow: "Our Story",
    title: "Cultivating Trust, Delivering Excellence",
    description:
      "From a humble beginning in Ludhiana to becoming a leading name in the dry fruit industry, our journey is defined by quality, integrity, and a passion for health.",
  },
  whoWeAre: {
    title: "Who We Are",
    description:
      "Divyansh International is a premier importer, processor, and distributor of high-quality dry fruits. With over two decades of experience, we have mastered the art of sourcing the finest nuts and dried fruits from around the globe. Our commitment goes beyond business; it's about building lasting relationships with our partners and consumers through transparency and consistent quality.",
  },
  mission: {
    title: "Our Mission",
    description:
      "To provide the finest quality dry fruits that promote health and wellness, while ensuring fair trade practices and sustainable sourcing.",
  },
  vision: {
    title: "Our Vision",
    description:
      "To be the most trusted global leader in the dry fruit industry, recognized for our innovation, quality, and commitment to customer satisfaction.",
  },
  commitment: {
    title: "Our Commitment to Excellence",
    description:
      "Our company continues to uphold its unwavering principles: superior sourcing, ethical pricing and quality-driven supply. Three decades of experience combined with a fully integrated supply chain to deliver quality, consistency and trust to our business partners.",
  },
  teamSection: {
    eyebrow: "Leadership",
    title: "Meet Our Team",
  },
  journeySection: {
    eyebrow: "Our Journey",
    title: "Milestones of Excellence",
  },
  distributionRegions: [
    {
      _key: "north",
      name: "Northern India",
      description: "Primary distribution hub",
      lat: 30.7333,
      lng: 76.7794,
      radius: 150000,
    },
    {
      _key: "delhi",
      name: "Delhi NCR",
      description: "Corporate headquarters & logistics",
      lat: 28.6139,
      lng: 77.209,
      radius: 40000,
    },
    {
      _key: "punjab",
      name: "Punjab",
      description: "Processing units",
      lat: 31.1471,
      lng: 75.3412,
      radius: 80000,
    },
    {
      _key: "haryana",
      name: "Haryana",
      description: "Supply chain network",
      lat: 29.0588,
      lng: 76.0856,
      radius: 60000,
    },
  ],
};

const headerData = {
  _id: "header",
  _type: "header",
  navLinks: [
    { _key: "nav-1", label: "About", url: "/about" },
    { _key: "nav-2", label: "Community", url: "/community" },
    { _key: "nav-3", label: "Contact", url: "/contact" },
    { _key: "nav-4", label: "Gallery", url: "/gallery" },
  ],
  tradeButtonText: "Get Quote",
  logoAlt: "Divyansh International Logo",
  homeAriaLabel: "Go to homepage",
  navAriaLabel: "Main navigation",
  menuAriaLabel: "Open mobile menu",
  closeMenuAriaLabel: "Close mobile menu",
  productsLabel: "Products",
};

const footerData = {
  _id: "footer",
  _type: "footer",
  quickLinks: [
    { _key: "ql-1", label: "Home", url: "/" },
    { _key: "ql-2", label: "About Us", url: "/about" },
    { _key: "ql-3", label: "Products", url: "/products" },
    { _key: "ql-4", label: "Community", url: "/community" },
  ],
  certificationBadges: [],
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  },
  copyrightText: "© 2026 Divyansh International. All rights reserved.",
  privacyNote: "Your data is secure with us.",
};

const siteSettingsData = {
  _id: "siteSettings",
  _type: "siteSettings",
  common: {
    viewSpecs: "View Specs",
    addToEnquiry: "Add to Enquiry",
    readMore: "Read More",
  },
  productCard: {
    placeholderText: "Product Media Placeholder",
    specificationsTitle: "Product Specifications",
    varietyLabel: "Variety:",
    applicationsLabel: "Applications:",
    packLabel: "Pack:",
    moqLabel: "Min. Order:",
  },
  organization: {
    name: "Divyansh International",
    url: "https://www.divyanshint.com",
    logoUrl: "https://www.divyanshint.com/logo.png",
    description: "Leading importer, processor and distributor of premium dry fruits in India.",
    address: {
      streetAddress: "K-2, Kismat Complex, Miller Ganj, G.T. Road",
      addressLocality: "Ludhiana",
      addressRegion: "Punjab",
      postalCode: "141003",
      addressCountry: "IN",
    },
    contactPoint: {
      telephone: "+91-9878122400",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "pa"],
    },
    tagline: "Premium Dry Fruits",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logo: undefined as any,
  },
  distribution: {
    heading: "Distribution Regions",
  },
  productDetail: {
    addToEnquiry: "Add to Enquiry",
    requestSample: "Request Sample",
    backToProducts: "Back to All Products",
    heroPlaceholder: "Product Media Placeholder",
    programSuffix: " Program",
  },
  productModal: {
    closeAria: "Close modal",
    placeholder: "Product Media Placeholder",
    addToEnquiry: "Add to Enquiry",
    requestSample: "Request Sample",
  },
  productList: {
    selectLabel: "Select",
    varietyLabel: "Variety:",
    packagingLabel: "Packaging:",
    quantityLabel: "Quantity:",
  },
  navigation: {
    home: "Home",
    about: "About Us",
    products: "Products",
    contact: "Contact",
    catalogue: "Catalogue",
    productsLabel: "Products",
    homeUrl: "/",
    aboutUrl: "/about",
    productsUrl: "/products",
    contactUrl: "/contact",
    catalogueUrl: "/catalogue",
  },
  seo: {
    siteUrl: "https://www.divyanshint.com",
    htmlLang: "en",
    metaTitle: "Divyansh International - Processors & Handlers",
    metaTitleSuffix: " | Divyansh International",
    metaDescription:
      "Divyansh International is one of the largest importer and distributor of premium dry fruits in the Northern Region of India.",
    keywords: [
      "dry fruits",
      "importer",
      "distributor",
      "almonds",
      "walnuts",
      "pistachios",
      "raisins",
      "coconut",
      "India",
    ],
    ogType: "website",
    twitterCardType: "summary_large_image",
    robots: {
      userAgent: "*",
      allowPath: "/",
      disallowPath: "/studio/",
      sitemapPath: "/sitemap.xml",
    },
    sitemap: {
      staticPages: [
        { _key: "home", path: "/", changeFrequency: "yearly", priority: 1 },
        { _key: "about", path: "/about", changeFrequency: "monthly", priority: 0.8 },
        { _key: "community", path: "/community", changeFrequency: "monthly", priority: 0.7 },
        { _key: "contact", path: "/contact", changeFrequency: "monthly", priority: 0.8 },
        { _key: "products", path: "/products", changeFrequency: "weekly", priority: 0.9 },
      ],
      productDefaults: {
        changeFrequency: "weekly",
        priority: 0.8,
      },
    },
  },
  enquiry: {
    gradeLabel: "Grade",
    notesLabel: "Notes",
    packFormatLabel: "Pack Format",
    quantityLabel: "Quantity",
    moqLabel: "Min. Order",
    emptyStateText: "Your enquiry is empty",
    pdfError: "Error generating PDF. Please try again.",
    emptyEnquiryError: "Please add items to your enquiry first.",
    openBuilderAria: "Open enquiry builder",
    gradePlaceholder: "Select grade",
    packFormatPlaceholder: "Select pack format",
    quantityPlaceholder: "Enter quantity",
    notesPlaceholder: "Add notes (optional)",
    saveLabel: "Save",
    cancelLabel: "Cancel",
    editLabel: "Edit",
    removeAriaLabel: "Remove item",
    floatingBar: {
      item: "item",
      items: "items",
      inYourEnquiry: "in your enquiry",
      readyToSubmit: "Ready to submit? Get quality pricing and available sizes.",
      viewEnquiry: "View Enquiry",
      submitEnquiry: "Submit Enquiry",
    },
    panel: {
      title: "Your Enquiry",
      emptyState: "Your enquiry is empty",
      emptyStateSub: "Browse our products and add items to create an enquiry.",
      exportPdf: "Export as PDF",
      submitEnquiry: "Submit Enquiry",
      clearAll: "Clear All",
      confirmClear: "Are you sure you want to clear all items from your enquiry?",
      closePanelAria: "Close enquiry panel",
    },
    builder: {
      buttonLabel: "Enquiry",
    },
  },
  forms: {
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    companyLabel: "Company",
    roleLabel: "Role (Optional)",
    countryLabel: "Country",
    productInterestLabel: "Product Interest (Select all that apply)",
    quantityLabel: "Estimated Quantity (Optional)",
    tradeQuantityPlaceholder: "e.g., 100kg, 1 MT",
    submitButton: "Send Message",
    submittingButton: "Sending...",
    successMessage:
      "Thank you! Your enquiry has been submitted successfully. We will get back to you soon.",
    errorMessage:
      "There was an error submitting your enquiry. Please try again or contact us directly.",
    requiredIndicator: "*",
    honeypotTabIndex: -1,
    generalEnquiryEndpoint: "/api/contact/general",
    tradeEnquiryEndpoint: "/api/contact/trade",
    sampleRequestMessage: "I am interested in requesting a sample for {product}.",
    enquiryListIntro: "Please find the following products in my enquiry:",
    populateEventName: "populateEnquiryForm",
    defaultTab: "general",
    tabValueGeneral: "general",
    tabValueTrade: "trade",
  },
  emailTemplates: {
    fromName: "Divyansh International",
    fromEmail: "onboarding@resend.dev",
    generalSubject: "New General Enquiry:",
    newGeneralEnquiryTitle: "New General Enquiry",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    naText: "N/A",
    tradeSubject: "New Get Quote:",
    newTradeEnquiryTitle: "New Get Quote",
    companyLabel: "Company",
    roleLabel: "Role",
    countryLabel: "Country",
    productsLabel: "Products",
    quantityLabel: "Quantity",
    noneText: "None",
  },
  apiMessages: {
    rateLimitError: "Too many requests. Please try again later.",
    validationError: "Invalid form data",
    serverError: "Internal server error",
    enquirySuccess: "Enquiry submitted successfully",
    pdfGenerationError: "Failed to generate PDF",
    pdfGenerationSuccess: "PDF generated successfully",
  },
  apiConfig: {
    rateLimitMaxRequests: 5,
    rateLimitWindowMs: 60000,
    unknownIpLabel: "unknown",
    fallbackEmail: "delivered@resend.dev",
    enquiryTypeGeneral: "general",
    enquiryTypeTrade: "trade",
    enquiryStatusNew: "new",
    listSeparator: ", ",
    breadcrumbSeparator: "/",
    enquiryIdPrefix: "ENQ-",
    httpMethodPost: "POST",
    contentTypeHeader: "Content-Type",
    contentTypeJson: "application/json",
  },
  validation: {
    nameMinLength: 2,
    nameMinError: "Name must be at least 2 characters",
    emailInvalidError: "Invalid email address",
    messageMinLength: 10,
    messageMinError: "Message must be at least 10 characters",
    companyMinLength: 2,
    companyRequiredError: "Company name is required",
    phoneMinLength: 10,
    phoneRequiredError: "Phone number is required",
    countryMinLength: 2,
    countryRequiredError: "Country is required",
    honeypotMaxLength: 0,
  },
  routing: {
    queryParamType: "type",
    queryParamProduct: "product",
    queryParamAction: "action",
    actionSample: "sample",
    scrollTargetContact: "contact",
    productsHash: "#products",
    productsSectionId: "products",
    aboutSectionId: "about",
    capabilitiesSectionId: "capabilities",
    ctaSectionId: "cta",
    heroSectionId: "hero",
    processSectionId: "process",
    sustainabilitySectionId: "sustainability",
    trustSectionId: "trust",
    testimonialsSectionId: "video-testimonials",
  },
  analytics: {
    eventAddToEnquiry: "addToEnquiry",
    eventAddToEnquiryGA: "add_to_enquiry",
    eventSampleRequest: "sample_request",
    eventFormSubmission: "form_submission",
    locationProductPage: "product_page",
    locationModal: "modal",
    formTypeGeneral: "general_enquiry",
    formTypeTrade: "trade_enquiry",
    paramFormType: "form_type",
  },
  footer: {
    companyTitle: "Divyansh International",
    companyDescription:
      "Divyansh International is one of the largest importer and distributor of premium dry fruits in the Northern Region of India.",
    quickLinksTitle: "Quick Links",
    productsTitle: "Dry Fruits",
    certificationsTitle: "Certifications",
    isoLabel: "ISO Certified",
    fssaiLabel: "FSSAI",
    copyrightText: "© 2026 Divyansh International. All rights reserved.",
    servingText: "Serving dry fruit buyers across Punjab, North India and pan-India since 1999.",
    privacyPolicyText: "Privacy Policy",
    privacyNote: "Your data is secure with us.",
  },
  heroConfig: {
    autoPlayInterval: 8000,
    slideNumberPadding: "0",
  },
  accessibility: {
    skipLinkText: "Skip to main content",
    skipLinkTarget: "#main-content",
    heroSectionAria: "Hero section",
    prevSlideAria: "Previous slide",
    nextSlideAria: "Next slide",
    goToSlideAria: "Go to slide",
    closePanelAria: "Close panel",
    closeModalAria: "Close modal",
    themeToggleAria: "Toggle theme",
    socialFacebookAria: "Visit our Facebook page",
    socialTwitterAria: "Visit our Twitter page",
    socialLinkedinAria: "Visit our LinkedIn page",
    socialInstagramAria: "Visit our Instagram page",
  },
  themeToggle: {
    toggleAria: "Toggle font style",
    title: "Font Style",
    modernLabel: "Modern",
    feminineLabel: "Elegant",
  },
  whatsapp: {
    phoneNumber: "919878122400",
    messageTemplate: "Hello, I'm interested in learning more about your products.",
    buttonLabel: "Chat on WhatsApp",
  },
  pdfTemplate: {
    companyName: "Divyansh International",
    title: "Product Enquiry",
    dateLabel: "Date:",
    referenceLabel: "Reference ID:",
    referencePrefix: "REF-",
    contactDetailsLabel: "Contact Details:",
    nameLabel: "Name:",
    companyLabel: "Company:",
    emailLabel: "Email:",
    phoneLabel: "Phone:",
    indexLabel: "#",
    naText: "N/A",
    emptyFieldText: "-",
    filenamePrefix: "enquiry-",
    tableHeaders: {
      product: "Product",
      grade: "Grade",
      packFormat: "Pack Format",
      quantity: "Quantity",
      moq: "Min. Order",
      notes: "Notes",
    },
    footerText1: "This is an automatically generated enquiry document.",
    footerText2: "Please contact us to discuss your requirements in detail.",
    styling: {
      fontFamily: "helvetica",
      fontStyleNormal: "normal",
      fontStyleBold: "bold",
      tableTheme: "striped",
      headerFontSize: 20,
      subtitleFontSize: 10,
      bodyFontSize: 9,
      footerFontSize: 8,
      tableFontSize: 9,
      tableCellPadding: 3,
      colors: {
        deepBrown: "101,67,33",
        gray: "100,100,100",
        black: "0,0,0",
        darkGray: "60,60,60",
        gold: "201,166,107",
        white: "255,255,255",
        lightGray: "150,150,150",
      },
      columnWidths: {
        index: 10,
        product: 40,
        grade: 25,
        packFormat: 25,
        quantity: 25,
        moq: 20,
        notes: 45,
      },
    },
  },
  error: {
    notFoundCode: "404",
    notFoundTitle: "Page Not Found",
    notFoundText:
      "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    backHomeButton: "Return Home",
    genericErrorTitle: "Something went wrong!",
    genericErrorText:
      "We apologize for the inconvenience. Please try again later or contact our support team if the issue persists.",
    tryAgainButton: "Try again",
  },
};

const contactPageData = {
  _id: "contactPage",
  _type: "contactPage",
  eyebrow: "Get in Touch",
  title: "Partner with India’s Trusted Dry Fruit Supplier",
  description:
    "Gain a competitive edge with consistent supply, superior quality and transparent pricing.",
  generalEnquiryLabel: "General Enquiry",
  tradeEnquiryLabel: "Get a Quote",
  contactDetailsTitle: "Contact Details",
  businessHoursTitle: "Business Hours",
  footerNote: "Serving dry fruit buyers across Punjab, North India and pan-India since 1999.",
  contactDetails: {
    address: "K-2, Kismat Complex, Miller Ganj, G.T. Road, Ludhiana – 141003, Punjab, India",
    phone: ["+91-9878122400", "+91-161-4662156"],
    email: "Care@divyanshint.com",
  },
  businessHours: {
    weekdays: "Monday – Saturday: 9:00 AM – 6:00 PM",
    sunday: "Sunday: Closed",
  },
  distributionRegions: [
    {
      _key: "north",
      name: "Northern India",
      description: "Primary distribution hub",
      lat: 30.7333,
      lng: 76.7794,
      radius: 150000,
    },
    {
      _key: "delhi",
      name: "Delhi NCR",
      description: "Corporate headquarters & logistics",
      lat: 28.6139,
      lng: 77.209,
      radius: 40000,
    },
    {
      _key: "punjab",
      name: "Punjab",
      description: "Processing units",
      lat: 31.1471,
      lng: 75.3412,
      radius: 80000,
    },
    {
      _key: "haryana",
      name: "Haryana",
      description: "Supply chain network",
      lat: 29.0588,
      lng: 76.0856,
      radius: 60000,
    },
  ],
};

const productsPageData = {
  _id: "productsPage",
  _type: "productsPage",
  eyebrow: "Our Harvest",
  title: "Premium Dry Fruits Collection",
  description:
    "Explore our range of hand-picked, export-quality nuts and dried fruits. Perfect for retail, processing, and gifting.",
};

const privacyPolicyData = {
  _id: "privacyPolicy",
  _type: "privacyPolicy",
  title: "Privacy Policy",
  lastUpdated: new Date().toISOString().split("T")[0],
  content: [
    {
      _key: "1",
      heading: "1. Information We Collect",
      body: [
        {
          _key: "block-1-1",
          _type: "block",
          children: [
            {
              _key: "span-1",
              _type: "span",
              text: "We collect information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.",
            },
          ],
        },
        {
          _key: "block-1-2",
          _type: "block",
          children: [
            {
              _key: "span-2",
              _type: "span",
              text: "Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the website or when you choose to participate in various activities related to the website.",
              marks: ["strong"],
            },
          ],
        },
        {
          _key: "block-1-3",
          _type: "block",
          children: [
            {
              _key: "span-3",
              _type: "span",
              text: "Derivative Data: Information our servers automatically collect when you access the website, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the website.",
              marks: ["strong"],
            },
          ],
        },
      ],
    },
    {
      _key: "2",
      heading: "2. Use of Your Information",
      body: [
        {
          _key: "block-2-1",
          _type: "block",
          children: [
            {
              _key: "span-4",
              _type: "span",
              text: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the website to:",
            },
          ],
        },
        {
          _key: "block-2-2",
          _type: "block",
          listItem: "bullet",
          children: [{ _key: "span-5", _type: "span", text: "Process your enquiries and orders." }],
        },
        {
          _key: "block-2-3",
          _type: "block",
          listItem: "bullet",
          children: [
            { _key: "span-6", _type: "span", text: "Email you regarding your account or order." },
          ],
        },
        {
          _key: "block-2-4",
          _type: "block",
          listItem: "bullet",
          children: [
            {
              _key: "span-7",
              _type: "span",
              text: "Fulfill and manage purchases, orders, payments, and other transactions related to the website.",
            },
          ],
        },
        {
          _key: "block-2-5",
          _type: "block",
          listItem: "bullet",
          children: [
            {
              _key: "span-8",
              _type: "span",
              text: "Generate a personal profile about you to make future visits to the website more personalized.",
            },
          ],
        },
        {
          _key: "block-2-6",
          _type: "block",
          listItem: "bullet",
          children: [
            {
              _key: "span-9",
              _type: "span",
              text: "Increase the efficiency and operation of the website.",
            },
          ],
        },
        {
          _key: "block-2-7",
          _type: "block",
          listItem: "bullet",
          children: [
            {
              _key: "span-10",
              _type: "span",
              text: "Monitor and analyze usage and trends to improve your experience with the website.",
            },
          ],
        },
      ],
    },
    {
      _key: "3",
      heading: "3. Disclosure of Your Information",
      body: [
        {
          _key: "block-3-1",
          _type: "block",
          children: [
            {
              _key: "span-11",
              _type: "span",
              text: "We may share information we have collected about you in certain situations. Your information may be disclosed as follows:",
            },
          ],
        },
        {
          _key: "block-3-2",
          _type: "block",
          children: [
            {
              _key: "span-12",
              _type: "span",
              text: "By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.",
              marks: ["strong"],
            },
          ],
        },
        {
          _key: "block-3-3",
          _type: "block",
          children: [
            {
              _key: "span-13",
              _type: "span",
              text: "Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
              marks: ["strong"],
            },
          ],
        },
      ],
    },
    {
      _key: "4",
      heading: "4. Security of Your Information",
      body: [
        {
          _key: "block-4-1",
          _type: "block",
          children: [
            {
              _key: "span-14",
              _type: "span",
              text: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
            },
          ],
        },
      ],
    },
    {
      _key: "5",
      heading: "5. Contact Us",
      body: [
        {
          _key: "block-5-1",
          _type: "block",
          children: [
            {
              _key: "span-15",
              _type: "span",
              text: "If you have questions or comments about this Privacy Policy, please contact us at:",
            },
          ],
        },
      ],
    },
  ],
};

const homePageData = {
  _id: "homePage",
  _type: "homePage",
  heroStats: [
    {
      _key: "exp",
      value: "25+",
      label: "Years Experience",
      detail: "Leading the industry since 1999",
    },
    {
      _key: "countries",
      value: "15+",
      label: "Countries Sourced",
      detail: "Sourcing from 15+ countries",
    },
    {
      _key: "partners",
      value: "1000+",
      label: "Global Partners",
      detail: "From across the globe",
    },
    {
      _key: "quality",
      value: "99%",
      label: "Quality Guarantee",
      detail: "ISO 22000 & HACCP Certified",
    },
  ],
  capabilitiesSection: {
    eyebrow: "Capabilities",
    title: "Engineered touchpoints from farm gate to finished packs",
    description:
      "Every facility and partnership is designed for processor-grade traceability, professional compliance, and private label readiness.",
    certificationsTitle: "Certified Excellence",
    certificationsDescription:
      "We adhere to the highest global standards of food safety and quality management.",
    backgroundImageUrl:
      "https://drive.google.com/file/d/1P7BswQdDh7LC3SqUq7rnJoACGiERAt5B/view?usp=sharing",
  },
  processSection: {
    eyebrow: "OUR PROCESS",
    title: "Quality Built at Every Step",
    description:
      "Our nuts and dry fruits elevate every product, enabling partners to scale with consistency and reliability.",
    backgroundImageUrl: "",
  },
  sustainabilitySection: {
    eyebrow: "Sustainability",
    title: "Building transparent supply chains with shared value",
    description:
      "We extend the value chain beyond purchase to farmer livelihoods, renewable operations, and inclusive hiring.",
    infographicImageUrl: "",
    backgroundImageUrl: "",
  },
  trustSection: {
    eyebrow: "Partners & Certifications",
    title: "Compliance-ready for retailers, hospitality, and export buyers",
    description:
      "We highlight globally accepted standards, retailer partnerships, and mission-critical certifications.",
    partnerSegments: [
      "Retail Chains",
      "Professional Purchase Desks",
      "Hospitality Groups",
      "Food Processing & Wellness Brands",
    ],
    backgroundImageUrl:
      "https://drive.google.com/file/d/1J5uUqoSBi6_rhAEpUU5rgNTmOiKtfYz2/view?usp=sharing",
  },
  productShowcaseSection: {
    eyebrow: "Our Products",
    title: "Premium dry fruits for trade, wholesale and export buyers",
    description:
      "Explore our almond, cashew, walnut, pistachio, raisin and desiccated coconut programs built for dependable sourcing.",
    backgroundImageUrl: "",
  },
  spiralQuoteSection: {
    buttonText: "Discover Our Story",
    backgroundImageUrl:
      "https://drive.google.com/file/d/1jwhqiXl17agiRrIgJWY2V2LBr3zx9t37/view?usp=sharing",
  },

  // =============================================================================
  // POSTER BANNER SECTION
  // =============================================================================
  posterBannerSection: {
    imageUrl: "https://drive.google.com/file/d/1f-4yXDVZ6-_PygqbH359oJf-YBEEL4Qj/view?usp=sharing",
    alt: "Quality at Every Step - Divyansh International",
    title: "",
  },

  featuredBanner: {
    imageUrl: "",
    title: "25 Years of Excellence",
    subtitle: "Premium Quality Since 1999",
  },
  droneDiaries: {
    eyebrow: "OUR FACILITY",
    title: "An Aerial Tour of Excellence",
    description:
      "Experience our state-of-the-art facility from above and witness the scale of our operations",
    backgroundImageUrl: "",
    videos: [
      {
        _key: "facility-aerial",
        title: "Facility Overview",
        description: "Aerial tour of our ISO-certified processing facility.",
        videoUrl: "https://youtu.be/6qCa_lNKxjw?si=hrgkehHGUnzCGxzN",
        thumbnailUrl: "",
      },
      {
        _key: "processing-line",
        title: "Processing Line",
        description: "See our advanced sorting, grading, and processing equipment in action",
        videoUrl: "",
        thumbnailUrl: "",
      },
      {
        _key: "quality-lab",
        title: "Quality Control Lab",
        description: "Our in-house quality testing and certification processes",
        videoUrl: "",
        thumbnailUrl: "",
      },
    ],
  },
  videoGallery: {
    eyebrow: "BEHIND THE SCENES",
    title: "Experience Our Facility",
    description:
      "Take a virtual tour of our operations, quality processes, and the people behind Divyansh International",
    videos: [
      {
        _key: "facility-tour",
        title: "Facility Tour",
        description:
          "Take a virtual tour of our state-of-the-art ISO-certified processing facility in Mullapur, Ludhiana",
        videoUrl: "",
      },
      {
        _key: "quality-process",
        title: "Quality Process",
        description:
          "See how we ensure premium quality through rigorous sorting, grading, and testing at every step",
        videoUrl: "",
      },
      {
        _key: "packaging",
        title: "Packaging Excellence",
        description:
          "Our advanced packaging systems and quality control measures for Premium and export requirements",
        videoUrl: "",
      },
      {
        _key: "team-culture",
        title: "Team & Culture",
        description:
          "Meet the people behind Divyansh International and our commitment to employee welfare",
        videoUrl: "",
      },
    ],
  },
  aboutSection: {
    whoWeAre: {
      eyebrow: "Who We Are",
      title: "Leading importer, processor and distributor of premium dry fruits in India",
      description:
        "Divyansh International is a leading importer, processor and distributor of premium dry fruits in India, with a strong foothold across Punjab, North India and pan-India markets.",
      stats: [
        { _key: "years", value: "25+", label: "Years in Business" },
        { _key: "countries", value: "15+", label: "Countries Sourced" },
        { _key: "partners", value: "1000+", label: "Partners" },
      ],
    },
    mission: {
      title: "Mission",
      description:
        "To deliver hygienic, premium-quality dry fruits that add value to every product and consumer it reaches.",
    },
    vision: {
      eyebrow: "Our Vision & Purpose",
      title: "Vision & Purpose",
      description:
        "To become India's most reliable dry fruits partner, known for integrity and excellence in supply.",
    },
    commitment: {
      title: "Our Commitment to Excellence",
      description:
        "Our company continues to uphold its unwavering principles: superior sourcing, ethical pricing and quality-driven supply. Three decades of experience combined with a fully integrated supply chain to deliver quality, consistency and trust to our business partners.",
    },
    timeline: {
      eyebrow: "Our Journey",
      title: "Our Journey",
      entries: [],
    },
    distribution: {
      title: "Distribution Network",
    },
  },
};

async function seed() {
  // =============================================================================
  // STEP 0: PURGE ALL EXISTING DOCUMENTS (Complete Reset)
  // =============================================================================

  const documentTypes = [
    "product",
    "heroSlide",
    "timeline",
    "capability",
    "processStep",
    "sustainabilityPillar",
    "certificate",
    "testimonial",
    "testimonialsSection",
    "homePage",
    "about",
    "community",
    "contactPage",
    "productsPage",
    "privacyPolicy",
    "header",
    "footer",
    "quote",
    "cta",
    "siteSettings",
    "catalogueSettings",
    "distributionRegion",
  ];

  for (const docType of documentTypes) {
    try {
      // Fetch all document IDs of this type
      const docs = await client.fetch<{ _id: string }[]>(`*[_type == "${docType}"]{ _id }`);

      if (docs.length > 0) {
        // Delete each document
        for (const doc of docs) {
          await client.delete(doc._id);
        }
      }
    } catch (error) {
      console.warn(`   ⚠️  Could not purge ${docType}:`, error);
    }
  }

  // 1. Products.

  async function uploadImage(filePath: string) {
    try {
      const buffer = fs.readFileSync(filePath);
      const asset = await client.assets.upload("image", buffer, {
        filename: path.basename(filePath),
      });
      return asset;
    } catch (error) {
      console.error(`Failed to upload image: ${filePath}`, error);
      return null;
    }
  }

  const logoPath = path.join(process.cwd(), "public", "Logo.png");
  let logoAsset = null;
  if (fs.existsSync(logoPath)) {
    logoAsset = await uploadImage(logoPath);
  } else {
    console.warn("⚠️ Logo file not found at " + logoPath);
  }

  if (logoAsset) {
    siteSettingsData.organization.logo = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: logoAsset._id,
      },
    };
  }
  try {
    for (const product of products) {
      const doc: {
        _type: string;
        _id: string;
        [key: string]: unknown;
      } = {
        _type: "product",
        _id: `product-${product.slug.current}`,
        title: product.title,
        slug: { _type: "slug", current: product.slug.current },
        category: product.category,
        heroHeading: product.heroHeading,
        introParagraphs: product.introParagraphs.map((p, index) => ({
          _key: `p-${index}`,
          ...p,
        })),
        listSections: product.listSections.map((section) => ({
          _key: section._key,
          title: section.title,
          items: section.items.map((item, idx) => ({
            _key: `item-${idx}`,
            ...item,
          })),
        })),
        ctaLine: product.ctaLine,
        description: product.description,
        heroImageUrl: product.heroImageUrl,
        gallery:
          product.gallery?.map((item: { imageUrl?: string; alt?: string }, index: number) => ({
            _key: `gallery-${index}`,
            imageUrl: item.imageUrl || "",
            alt: item.alt || "",
          })) || [],
        pricing: product.pricing,
        specifications: product.specifications,
        applications: product.applications,
        order: product.order,
      };

      if ("almondVarieties" in product && product.almondVarieties) {
        doc["almondVarieties"] = product.almondVarieties;
      }
      if ("productGrading" in product && product.productGrading) {
        doc["productGrading"] = product.productGrading;
      }

      await safeCreateOrReplace(doc);
    }
  } catch {}

  // 2. Hero Slides.
  for (const slide of heroSlides) {
    const doc = {
      _type: "heroSlide",
      _id: `heroSlide-${slide._id}`,
      eyebrow: slide.eyebrow,
      badge: slide.badge,
      headline: slide.headline,
      paragraphs: slide.paragraphs,
      primaryCta: slide.primaryCta,
      secondaryCta: slide.secondaryCta,
      videoUrl: slide.videoUrl,
      posterImageUrl: slide.posterImageUrl,
      order: parseInt(slide._id),
    };
    await client.createOrReplace(doc);
  }

  // 3. Timeline.
  for (const entry of timeline) {
    const doc = {
      _type: "timeline",
      _id: `timeline-${entry.year}`,
      year: entry.year,
      title: entry.title,
      description: entry.description,
      imageUrl: entry.imageUrl,
    };
    await client.createOrReplace(doc);
  }

  // 4. Team.
  for (const member of teamMembers) {
    const doc = {
      _type: "teamMember",
      _id: `team-${member._id}`,
      name: member.name,
      role: member.role,
      imageUrl: member.imageUrl,
    };
    await client.createOrReplace(doc);
  }

  // 5. Capabilities.
  for (const capability of capabilities) {
    const doc = {
      _type: "capability",
      _id: `capability-${capability._id}`,
      title: capability.title,
      description: capability.description,
      metric: capability.metric,
      order: capability.order,
    };
    await client.createOrReplace(doc);
  }

  // 6. Brands.
  for (const brand of brands) {
    const doc = {
      _type: "brand",
      _id: `brand-${brand._id}`,
      name: brand.name,
      brandCopy: brand.brandCopy,
      productSKUs: brand.productSKUs,
      distributionContacts: brand.distributionContacts,
      heroImageUrl: brand.heroImageUrl,
      order: brand.order,
    };
    await client.createOrReplace(doc);
  }

  // 7. Certificates.
  for (const certificate of certificates) {
    const doc = {
      _type: "certificate",
      _id: `certificate-${certificate._id}`,
      name: certificate.name,
      label: certificate.label,
      order: certificate.order,
      imageUrl: certificate.imageUrl,
    };
    await client.createOrReplace(doc);
  }

  // 8. Community.
  await client.createOrReplace(communityData);

  // 9. Process Steps.
  for (const step of processSteps) {
    const doc = {
      _type: "processStep",
      _id: `process-${step._id}`,
      title: step.title,
      detail: step.detail,
      order: step.order,
    };
    await client.createOrReplace(doc);
  }

  // 10. Sustainability Pillars.
  for (const pillar of sustainabilityPillars) {
    const doc = {
      _type: "sustainabilityPillar",
      _id: `sustainability-${pillar._id}`,
      title: pillar.title,
      detail: pillar.detail,
      order: pillar.order,
    };
    await client.createOrReplace(doc);
  }

  // 11. Quote.
  await client.createOrReplace(quoteData);

  // 12. CTA.
  await client.createOrReplace(ctaData);

  // 13. Testimonials Section.
  await client.createOrReplace(testimonialsSectionData);

  // 14. Values.
  for (const value of values) {
    const doc = {
      _type: "value",
      _id: `value-${value._id}`,
      title: value.title,
      description: value.description,
      icon: value.icon,
      order: value.order,
    };
    await client.createOrReplace(doc);
  }

  // 15. Testimonials.
  for (const t of testimonials) {
    const doc = {
      _type: "testimonial",
      _id: `testimonial-${t._id}`,
      quote: t.quote,
      author: t.author,
      role: t.role,
    };
    await client.createOrReplace(doc);
  }

  // 16. About Page.
  await client.createOrReplace(aboutData);

  // 17. Site Settings.
  await client.createOrReplace(siteSettingsData);

  // 18. Contact Page.
  await client.createOrReplace(contactPageData);

  // 19. Products Page.
  await client.createOrReplace(productsPageData);

  // 20. Home Page.
  await client.createOrReplace(homePageData);

  // 21. Header.
  await client.createOrReplace(headerData);

  // 22. Footer.
  await client.createOrReplace(footerData);

  // 23. Privacy Policy.
  await client.createOrReplace(privacyPolicyData);

  // 24. FlipHTML5 Settings.
  const fliphtml5SettingsData = {
    _id: "fliphtml5Settings",
    _type: "fliphtml5Settings",
    catalogueUrl: "https://online.fliphtml5.com/wxsdv/Module_1/#google_vignette",
    mobileOptimizedUrl: "",
    pdfFile: null,
    pdfDownloadUrl: "",
    title: "Product Catalogue",
    description:
      "Explore our premium collection of dry fruits, nuts, and specialty products with our interactive digital catalogue.",
    version: "2024.1",
    lastUpdated: new Date().toISOString(),
    isActive: true,
  };
  await client.createOrReplace(fliphtml5SettingsData);

  const droneSectionData = {
    eyebrow: "AERIAL TOUR",
    title: "Our Facility",
    note: "Experience our world-class facilities from above.",
    videos: [
      {
        _key: "vid1",
        title: "Facility Overview",
        description: "Aerial view of our processing facility",
        videoUrl: "https://youtu.be/0ZD8ukKe7zU?si=zu1lLx2Tdmvs9qNd",
      },
    ],
  };

  const currentSection = await client.fetch('*[_type == "testimonialsSection"][0]');
  if (!currentSection) {
    await client.create({
      _type: "testimonialsSection",
      _id: "testimonialsSection",
      title: "Client Success Stories",
      eyebrow: "TESTIMONIALS",
      droneSection: droneSectionData,
    });
  } else {
    await client
      .patch(currentSection._id)
      .set({
        droneSection: droneSectionData,
      })
      .unset(["videoTestimonialsSection"])
      .commit();
  }

  // Gallery Page
  const galleryPageData = {
    _type: "galleryPage",
    _id: "galleryPage",
    title: "Our Gallery",
    description:
      "A glimpse into our world of premium dry fruits, processing facilities, and community initiatives.",
    images: [
      "https://drive.google.com/file/d/1GfRJxhOLJ9I96SevDWZWV3E0EoJedS6s/view?usp=sharing", // 1
      "https://drive.google.com/file/d/1ymcfEVBM-C8y-WTGeVG42-h_CagS_WGi/view?usp=sharing", // 2
      "https://drive.google.com/file/d/1tsrqLbkqBhIY27BjQTRfTu89VcJQH6p8/view?usp=sharing", // 3
      "https://drive.google.com/file/d/1QFvObVR-RUztgCp0ckJgS9vxvfyG0Y-i/view?usp=sharing", // 4
      "https://drive.google.com/file/d/1zfxdBumA4tU9m_cy-PpfGLA7nfCuN62i/view?usp=sharing", // 5
      "https://drive.google.com/file/d/1d_ey-vMLHqAqB99UhAsOBdvLLRYSXeE-/view?usp=sharing", // 6
      "https://drive.google.com/file/d/1bLxEFVGtzceJeWwZzqdCMImqhqBBgKeT/view?usp=sharing", // 7
      "https://drive.google.com/file/d/13v1B4D7eQUiZYmda3Q1TIL96Oe61lfLj/view?usp=sharing", // 8
      "https://drive.google.com/file/d/1Loq3rnipk9XCLu6GvgWU3NQuaoXgrV_I/view?usp=sharing", // 9
      "https://drive.google.com/file/d/198rl6ltP6gs3q97BN2F9h2WE6hxlXcPy/view?usp=sharing", // 10
      "https://drive.google.com/file/d/1ecMuzHNhQxPKmKjHMI7NAopIvSn9K2KQ/view?usp=sharing", // 11
      "https://drive.google.com/file/d/1ed545oP0JbWj5Q8DStnaFuRxGHed9-Yi/view?usp=sharing", // 12
      "https://drive.google.com/file/d/14ZDug3z9-etlFuRDMtBAIvhfed70fxOZ/view?usp=sharing", // 13
      "https://drive.google.com/file/d/1CBS340wBZsdiPkQ0z83kVMaPKXaErOoa/view?usp=sharing", // 14
      "https://drive.google.com/file/d/1oNj6m_bWXs16KanDR_weywqd_Lra0tyD/view?usp=sharing", // 15
      "https://drive.google.com/file/d/13nLr2Apl8q06l_4eySd1smjyYo_vaqrR/view?usp=sharing", // 16
      "https://drive.google.com/file/d/16WJ1nl89zm3Vs6OKP_v2ZccUBVCuFml7/view?usp=sharing", // 17
      "https://drive.google.com/file/d/1yQSmSLvvbfVhisNOIa5No1J5gsjp8hyL/view?usp=sharing", // 18
      "https://drive.google.com/file/d/1TxfLgN2-we5ErYcsqbi11ALcgNvKhfhd/view?usp=sharing", // 19
      "https://drive.google.com/file/d/1N4lgEUixEHyhkl7vpQX6lmkNL4-9dJXk/view?usp=sharing", // 20
      "https://drive.google.com/file/d/1pm7Ln-9JfrJxhE1ZyPDv-U5TeaVhSlWU/view?usp=sharing", // 21
      "https://drive.google.com/file/d/1lZhXjBrsuh6I5SsLhIIgzcFrK35BNP4u/view?usp=sharing", // 22
      "https://drive.google.com/file/d/1cI3-pwZy02nb8zu1yq8R4Hn8JouvLbCy/view?usp=sharing", // 23
      "https://drive.google.com/file/d/1JJjmqxgj2v_tzP8gSJYjuTxguLJufKoC/view?usp=sharing", // 24
      "https://drive.google.com/file/d/17UiXidpReK2miy3AWLd5T0qs1Jg-ZImA/view?usp=sharing", // 25
      "https://drive.google.com/file/d/1xeFd5totKKHzmv3I-4Zl8SGpSMf-PH9v/view?usp=sharing", // 26
      "https://drive.google.com/file/d/1mOMkAlLJ8Gef1GBxWVByKBz3tbZs2v3z/view?usp=sharing", // 27
      "https://drive.google.com/file/d/1e-89nRAVMjaktCqDPHYFT6LYTep1xnyw/view?usp=sharing", // 28
      "https://drive.google.com/file/d/12gx1W8sRCBHi79iJS2QIKZesShwyWXS7/view?usp=sharing", // 29
      "https://drive.google.com/file/d/1lMmTpHtTe4BdOgTk1t6WAvjFEUctpWCf/view?usp=sharing", // 30
      "https://drive.google.com/file/d/1Q5Qalco07gLJfh1wMGT2jxNZhnkMRXrf/view?usp=sharing", // 31
      "https://drive.google.com/file/d/1oLz-DBw5PwTjwsBTUp_3fkZl9d8gF2cA/view?usp=sharing", // 32
      "https://drive.google.com/file/d/1C2djRXzUqs2GP04HeX9CDCDQGC9JCiaG/view?usp=sharing", // 33
      "https://drive.google.com/file/d/1vuMPgXXzWRyScP0SEx7Z7gwS1jjy42OO/view?usp=sharing", // 34
      "https://drive.google.com/file/d/163beCoelPW0TS48LJTnyvbzFwHPOM22-/view?usp=sharing", // 35
      "https://drive.google.com/file/d/1G0usel3Tnbx7wggF4R1n1Y2aJM6CM6zn/view?usp=sharing", // 36
      "https://drive.google.com/file/d/17nLL3JJTGQbJnbZjHmEzSokG6FXttMr4/view?usp=sharing", // 37
      "https://drive.google.com/file/d/1KmgRRAB0ELDKRikfgLdSzyKhzwYHBRYZ/view?usp=sharing", // 38
      "https://drive.google.com/file/d/1oe2K30hnGjQDC2gwHkMlQ3EcIVRGcJ3J/view?usp=sharing", // 39
      "https://drive.google.com/file/d/1utoOjtAyVD9ubt6xk53Cnr46tTWP8m3Y/view?usp=sharing", // 40
    ].map((url, index) => ({
      _type: "galleryImage",
      _key: `imported-img-${index}`,
      title: `Gallery Image ${index + 1}`,
      category: "other",
      imageUrl: url,
      aspectRatio: "auto",
    })),
  };

  const currentGallery = await client.fetch('*[_type == "galleryPage"][0]');
  if (!currentGallery) {
    await client.create(galleryPageData);
  } else {
    await client.createOrReplace(galleryPageData);
  }

  const regionNames = [
    { name: "Delhi NCR", lat: 28.6139, lng: 77.209, radius: 40000 },
    { name: "Punjab", lat: 31.1471, lng: 75.3412, radius: 70000 },
    { name: "Haryana", lat: 29.0588, lng: 76.0856, radius: 60000 },
  ];
  for (const region of regionNames) {
    await client.createOrReplace({
      _type: "distributionRegion",
      _id: `region-${region.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: region.name,
      description: `Active distribution region in ${region.name}`,
      lat: region.lat,
      lng: region.lng,
      radius: region.radius,
    });
  }

  // eslint-disable-next-line no-console
  console.log("\n✅ Seeding Complete!");
}

seed().catch((err) => {
  console.error("\n" + "=".repeat(50));
  console.error("❌ Seed Failed!");
  console.error("=".repeat(50));
  console.error("Error Details:", err);
  console.error("=".repeat(50) + "\n");
  process.exit(1);
});
