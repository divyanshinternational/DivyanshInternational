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
    _id: "1",
    title: createLocaleString("Almonds"),
    category: "almonds",
    slug: { current: "almonds" },
    heroHeading: createLocaleString(
      "Bulk Almonds Supplier – India’s Trusted Importer for Trade & Institutional Buyers"
    ),
    introParagraphs: [
      createLocaleText(
        "Divyansh International is one of India's most reliable importers and bulk distributors of premium almonds, serving modern trade, wholesalers, food manufacturers and institutional buyers across the country."
      ),
      createLocaleText(
        "We directly source high-quality raw almonds from trusted growers worldwide — ensuring consistency, freshness and fair pricing for B2B clients seeking long-term supply partnerships."
      ),
    ],
    listSections: [
      {
        _key: "ls-1",
        title: createLocaleString("Almond Varieties We Offer"),
        items: [
          createLocaleString("Non-Pareil Almonds (high demand for bulk and retail packaging)"),
          createLocaleString("Independence Almonds (cost-effective, versatile quality)"),
          createLocaleString(
            "Mamra Almonds (premium, oil-rich, ideal for gifting & high-end retailers)"
          ),
          createLocaleString("Gurbandi Almonds (small-sized, nutrient dense)"),
          createLocaleString("Sonora Almonds"),
          createLocaleString(
            "Carmel / Sonora Almonds (mid-grade, suitable for value packs and food processing needs)"
          ),
          createLocaleString(
            "Peerless Almonds (mid-grade, balanced taste, preferred for snacking and processing)"
          ),
          createLocaleString(
            "Monterey Almonds (larger size, smooth surface, popular for roasting and snacking)"
          ),
          createLocaleString(
            "Shasta Almonds (uniform size, light colour, good for confectionery and processed foods)"
          ),
          createLocaleString(
            "Supareil Almonds (long and narrow shape, premium look, often used for luxury confectionery and exports)"
          ),
          createLocaleString(
            "Price Almonds (versatile, mild flavour, widely used for mixed packs and commercial food applications)"
          ),
          createLocaleString("Inshell & Kernel – All Varieties Available"),
        ],
      },
      {
        _key: "ls-2",
        title: createLocaleString("Grades & Size Options"),
        items: [
          createLocaleString("Sui / Single / Double"),
          createLocaleString("Broken / Chipped / Blanched"),
        ],
      },
      {
        _key: "ls-3",
        title: createLocaleString("Packaging Formats Available"),
        items: [
          createLocaleString("Inshell 22.6 kg bag and Kernels in 25 kg"),
          createLocaleString("Vacuum pouches for institutional supply"),
        ],
      },
      {
        _key: "ls-4",
        title: createLocaleString("Why Choose Us as Your Almond Partner?"),
        items: [
          createLocaleString("ISO-certified quality"),
          createLocaleString("Consistent year-round supply"),
          createLocaleString("Facility for daily processing, cleaning & custom sorting"),
          createLocaleString("Fast delivery across Punjab, North India & pan-India"),
          createLocaleString("Competitive pricing for bulk almond procurement"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Looking for a dependable bulk almond supplier? Contact us today for wholesale almond prices and MOQ details."
    ),
    description: createLocaleText(
      "Premium almonds for modern trade, wholesale and institutional buyers."
    ),
    pricing: { currentPrice: 1299, originalPrice: 1599, discount: 19 },
    specifications: {
      origin: "California, USA / India",
      variety: "Multiple Premium Grades",
      packaging: "Bulk Packs (10-25 kg)",
      shelfLife: "12 Months",
      storage: "Cool & Dry Place",
    },
    applications: [
      "Food processing and manufacturing",
      "Retail and wholesale distribution",
      "Export and international trade",
      "Confectionery and bakery applications",
    ],
    varieties: [
      {
        name: "Non-Pareil Almonds",
        description: "High demand for bulk and retail packaging",
        grade: "Premium",
        color: "from-amber-100 to-amber-200",
      },
      {
        name: "Independence Almonds",
        description: "Cost-effective, versatile quality",
        grade: "Standard",
        color: "from-orange-100 to-orange-200",
      },
      {
        name: "Mamra Almonds",
        description: "Premium, oil-rich, ideal for gifting & high-end retailers",
        grade: "Premium+",
        color: "from-yellow-100 to-yellow-200",
      },
      {
        name: "Gurbandi Almonds",
        description: "Small-sized, nutrient dense",
        grade: "Premium",
        color: "from-amber-100 to-amber-200",
      },
      {
        name: "Sonora Almonds",
        description: "Mid-grade quality",
        grade: "Standard",
        color: "from-orange-100 to-orange-200",
      },
      {
        name: "Carmel / Sonora Almonds",
        description: "Mid-grade, suitable for value packs and food processing needs",
        grade: "Standard",
        color: "from-orange-100 to-orange-200",
      },
      {
        name: "Peerless Almonds",
        description: "Mid-grade, balanced taste, preferred for snacking and processing",
        grade: "Standard",
        color: "from-orange-100 to-orange-200",
      },
      {
        name: "Monterey Almonds",
        description: "Larger size, smooth surface, popular for roasting and snacking",
        grade: "Premium",
        color: "from-amber-100 to-amber-200",
      },
      {
        name: "Shasta Almonds",
        description: "Uniform size, light colour, good for confectionery and processed foods",
        grade: "Standard",
        color: "from-orange-100 to-orange-200",
      },
      {
        name: "Supareil Almonds",
        description:
          "Long and narrow shape, premium look, often used for luxury confectionery and exports",
        grade: "Premium+",
        color: "from-yellow-100 to-yellow-200",
      },
    ],
  },
  {
    _id: "2",
    title: createLocaleString("Walnuts"),
    category: "walnuts",
    slug: { current: "walnuts" },
    heroHeading: createLocaleString(
      "Trusted Bulk Walnut Importer & Kashmiri Walnut Distributor in India"
    ),
    introParagraphs: [
      createLocaleText(
        "Divyansh International supplies premium-grade walnuts in bulk, sourced from the best farms across the globe."
      ),
      createLocaleText(
        "As a long-standing B2B importer and distributor, we cater to modern trade buyers, wholesale traders, dry fruit packers, food manufacturers and institutional procurement teams across India."
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
          createLocaleString("Dedicated B2B pricing and quick dispatch"),
          createLocaleString("Ideal for resellers, repackers and institutional tenders"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Looking for wholesale walnut rates? Get in touch for price lists, samples and annual supply contracts."
    ),
    description: createLocaleText(
      "Bulk walnuts and kernels with stringent grading for retailers, food processors and exporters."
    ),
    pricing: { currentPrice: 899, originalPrice: 1199, discount: 25 },
    specifications: {
      origin: "India (Kashmir) / Chile / USA",
      variety: "Premium Grade",
      packaging: "Bulk Packs",
      shelfLife: "12 Months",
      storage: "Cool & Dry Place",
    },
    applications: [
      "Food processing and manufacturing",
      "Retail and wholesale distribution",
      "Export and international trade",
    ],
  },
  {
    _id: "3",
    title: createLocaleString("Pistachios"),
    category: "pistachio",
    slug: { current: "pistachios" },
    heroHeading: createLocaleString(
      "Bulk Pistachio Importer & Premium Pistachio Distributor in India"
    ),
    introParagraphs: [
      createLocaleText(
        "Divyansh International supplies high-quality pistachios catering to India's B2B requirements in modern trade, HORECA, wholesale, institutional consumption and gifting segments."
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
            "Premium Pistachios – Bold, mildly sweet flavour, preferred for modern trade & export buyers"
          ),
          createLocaleString(
            "Gourmet Pistachios – Naturally rich flavour & deeper green kernel, ideal for premium gifting & gourmet segment"
          ),
        ],
      },
      {
        _key: "ls-9",
        title: createLocaleString("Grades Offered"),
        items: [createLocaleString("Whole Pistachios In-Shell")],
      },
      {
        _key: "ls-10",
        title: createLocaleString("Packaging Formats"),
        items: [
          createLocaleString("10kg & 20kg imported cartons"),
          createLocaleString("5kg vacuum packs for institutional use"),
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
      "Need premium pistachio pricing & samples for bulk buying? Contact us for today’s wholesale quotes."
    ),
    description: createLocaleText(
      "Premium pistachios graded for modern trade, HORECA and gifting programs."
    ),
    pricing: { currentPrice: 8999, originalPrice: 10499, discount: 14 },
    specifications: {
      origin: "California, USA",
      variety: "Premium Grade",
      packaging: "12 kg Bulk Packs",
      shelfLife: "12 Months",
      storage: "Cool & Dry Place",
    },
    applications: [
      "Food processing and manufacturing",
      "Premium gifting and retail",
      "Export and international trade",
      "Confectionery and bakery applications",
    ],
  },
  {
    _id: "4",
    title: createLocaleString("Raisins (Kishmish)"),
    category: "raisins",
    slug: { current: "raisins" },
    heroHeading: createLocaleString("Bulk Kishmish Supplier – India"),
    introParagraphs: [
      createLocaleText(
        "Divyansh International has established itself as a reliable importer and wholesale supplier of raisins (kishmish) for B2B buyers across India."
      ),
      createLocaleText(
        "We source premium-quality harvests to offer multiple grades, price points and flavour profiles under one roof. Our raisins are sorted, cleaned and packed hygienically – making them ideal for packagers, bakeries, mithai/confectionery units, retailers and institutional procurement."
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
          createLocaleString("Trusted supplier to wholesalers, HORECA, modern trade & exporters"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Looking to buy raisins in bulk? Enquire now about wholesale price lists and yearly supply contracts."
    ),
    description: createLocaleText(
      "Golden, Indian and Kandhari raisins processed hygienically for wholesale and institutional demand."
    ),
    pricing: { currentPrice: 899, originalPrice: 1199, discount: 25 },
    specifications: {
      origin: "India",
      variety: "Premium Grade",
      packaging: "Bulk Packs",
      shelfLife: "12 Months",
      storage: "Cool & Dry Place",
    },
    applications: [
      "Food processing and manufacturing",
      "Retail and wholesale distribution",
      "Export and international trade",
    ],
  },
  {
    _id: "5",
    title: createLocaleString("Desiccated Coconut"),
    category: "coconut",
    slug: { current: "desiccated-coconut" },
    heroHeading: createLocaleString("Bulk Desiccated Coconut & Copra Supplier – India"),
    introParagraphs: [
      createLocaleText(
        "Divyansh International offers high-grade desiccated coconut products for both industrial buyers and wholesale trade partners across India."
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
          createLocaleString(
            "Customised 1kg & 500gm private label packs for modern trade / export"
          ),
        ],
      },
      {
        _key: "ls-17",
        title: createLocaleString("Why Buy from Divyansh International?"),
        items: [
          createLocaleString("Consistent high-fat, fresh stock"),
          createLocaleString("Hygienic drying & moisture-controlled packing"),
          createLocaleString("Trusted supplier to FMCG brands and wholesale dry fruit traders"),
          createLocaleString("Rapid delivery across Punjab, North India & pan-India"),
        ],
      },
    ],
    ctaLine: createLocaleString(
      "Need desiccated coconut for industrial use or repackaging? Request our bulk pricing & MOQ today."
    ),
    description: createLocaleText(
      "Fine powder, flakes and copra variants for industrial, retail and private-label coconut programs."
    ),
    pricing: { currentPrice: 2499, originalPrice: 2999, discount: 17 },
    specifications: {
      origin: "India",
      variety: "Premium Grade Desiccated",
      packaging: "25 kg Bulk Packs",
      shelfLife: "18 Months",
      storage: "Cool & Dry Place",
    },
    applications: [
      "Bakery products such as cakes and biscuits",
      "Traditional sweets and puddings",
      "Confectionery manufacturing",
      "Large-scale food preparation",
    ],
  },
];

const heroSlides = [
  {
    _id: "0",
    eyebrow: "Since 1999",
    badge: "Leading ISO-certified importer",
    headline: "Premium Dry Fruits: Nature's Finest Harvest",
    paragraphs: [
      "Since 1999, Divyansh International has been a trusted ISO-certified importer and distributor of premium almonds and high-quality dry fruits across Ludhiana, Punjab and North India.",
      "Sourced directly from the finest orchards, we ensure every kernel meets our rigorous standards of purity and taste.",
    ],
    primaryCta: { label: "Explore Our Collection", target: "products" },
    secondaryCta: { label: "Contact Trade Desk", target: "contact" },
    videoUrl: "https://cdn.coverr.co/videos/coverr-hand-scooping-almonds-5583/1080p.mp4",
    posterUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?w=1920&q=80",
  },
];

const timeline = [
  {
    _id: "1",
    year: 1900,
    title: "The Beginning – Gujranwala",
    description:
      "A well-established wholesale spices business thrived in Gujranwala, Punjab (then part of undivided India, now Pakistan).",
  },
  {
    _id: "2",
    year: 1947,
    title: "Partition & New Beginnings",
    description:
      "Following Partition, the family migrated to Ludhiana, Punjab—empty-handed but rich in experience and determination. At just 11 years of age, Mr. Som Nath Sethi marked a new beginning in India by starting a wholesale and retail grocery store.",
  },
  {
    _id: "3",
    year: 1969,
    title: "HoReCa Expansion",
    description:
      "Mr. Raman Sethi expanded operations into the HoReCa (Hotel, Restaurant & Catering) segment, strengthening the business's professional footprint.",
  },
  {
    _id: "4",
    year: 1984,
    title: "Third Generation Joins",
    description:
      "During the turbulent years of riots and emergency in Punjab, Mr. Sanjeev Sethi joined the business in his teenage years, dedicating himself to serving the people of Punjab—an involvement that became lifelong.",
  },
  {
    _id: "5",
    year: 1999,
    title: "Divyansh International – California Almonds",
    description:
      "The family branched out internationally with the launch of Divyansh International, beginning imports of California Almonds.",
  },
  {
    _id: "6",
    year: 2015,
    title: "Portfolio Expansion – Walnuts",
    description:
      "Mr. Divyansh Sethi, with a next-generation approach, expanded the portfolio to include Walnuts, scaling operations with a strong foundation in finance and marketing.",
  },
  {
    _id: "7",
    year: 2021,
    title: "Zonaar Global – International Trade",
    description:
      "Divyansh International further expanded its global footprint by initiating international trade facilitation and brokerage under the name Zonaar Global, connecting markets and partners across borders with trust, expertise, and efficiency.",
  },
  {
    _id: "8",
    year: 2022,
    title: "State-of-the-Art Facility – Mullapur",
    description:
      "Operations expanded to a state-of-the-art facility in Mullapur, Ludhiana—ISO & FSSAI certified—marking a major infrastructural milestone and reinforcing the group's commitment to quality and compliance.",
  },
  {
    _id: "9",
    year: 2023,
    title: "The Badam Factory – Heritage Retail",
    description:
      "Launched a heritage retail outlet, 'The Badam Factory', at the original workplace—reviving the name affectionately given by the people.",
  },
  {
    _id: "10",
    year: 2025,
    title: "The Betternut Co. – Modern Conscious Living",
    description:
      "Launch of The Betternut Co., ushering the legacy into a modern, conscious-living brand—focused on mindfulness and well-being through food.",
  },
];

const teamMembers = [
  {
    _id: "1",
    name: "Rajesh Kumar",
    role: "Founder & Chairman",
  },
  {
    _id: "2",
    name: "Amit Singh",
    role: "Managing Director",
  },
  {
    _id: "3",
    name: "Priya Sharma",
    role: "Head of Operations",
  },
];

const capabilities = [
  {
    _id: "1",
    title: "Global Sourcing Network",
    description:
      "Direct partnerships with growers across 15+ countries ensure year-round availability and competitive pricing for bulk buyers.",
    metric: "15+ Origins",
    order: 1,
  },
  {
    _id: "2",
    title: "ISO-Certified Processing",
    description:
      "State-of-the-art facility with daily cleaning, sorting, and custom grading to meet institutional and export standards.",
    metric: "ISO 22000",
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
      "Fast delivery across Punjab, North India, and nationwide with dedicated logistics for modern trade and institutional buyers.",
    metric: "Pan-India",
    order: 4,
  },
  {
    _id: "5",
    title: "Quality Assurance",
    description:
      "Rigorous testing and quality control at every stage from sourcing to packaging ensures consistent premium quality.",
    metric: "100% QA",
    order: 5,
  },
  {
    _id: "6",
    title: "B2B Expertise",
    description:
      "Over 25 years of experience serving wholesalers, modern trade, HORECA, and institutional procurement teams.",
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
    order: 1,
  },
  {
    _id: "sethi-mawa",
    name: "Sethi Mawa",
    brandCopy:
      "Sethi Mawa brings traditional flavors to modern markets. A trusted name in quality food products.",
    productSKUs: ["SM-001", "SM-002"],
    order: 2,
  },
  {
    _id: "butternut",
    name: "Butternut",
    brandCopy:
      "Butternut offers a wide range of premium dry fruits and nuts for everyday consumption.",
    productSKUs: ["BN-001", "BN-002"],
    order: 3,
  },
];

const certificates = [
  {
    _id: "1",
    name: "ISO 22000",
    label: "2015",
    order: 1,
  },
  {
    _id: "2",
    name: "HACCP",
    label: "Certified",
    order: 2,
  },
  {
    _id: "3",
    name: "FSSAI",
    label: "Licensed",
    order: 3,
  },
  {
    _id: "4",
    name: "ISO 9001",
    label: "2015",
    order: 4,
  },
];

const testimonials = [
  {
    _id: "0",
    quote:
      "Divyansh delivers the responsiveness and QA rigor we expect from leading processors. RFQs, lab updates and dispatch milestones arrive without chasing.",
    author: "Head of Procurement",
    role: "Modern Trade Retailer",
  },
];

const communityData = {
  _id: "community",
  _type: "community",

  header: {
    eyebrow: "Community at Divyansh International",
    title: "Responsibility That Grows Alongside the Business",
    subtitle:
      "Divyansh International was built on the belief that a business does not grow in isolation. Every milestone achieved carries a responsibility towards the people and ecosystems that make that growth possible.",
  },

  corePhilosophy: {
    paragraph:
      "Community, for the organisation, is not limited to external initiatives. It begins with employees, extends to their families, supports education, strengthens industry collaboration, and respects the environment.",
    highlight:
      "This people-first approach reflects the values that guide Divyansh International as a responsible and purpose-driven organisation.",
  },

  educationSection: {
    icon: "📚",
    title: "Giving Back Through Education",
    paragraphs: [
      "As part of its broader commitment to social responsibility, Divyansh International actively associates with government schools that serve underprivileged communities. The focus is on consistent involvement rather than one-time support.",
      "The organisation contributes wherever there is a genuine need — participating in initiatives, addressing essential requirements, and supporting learning environments through ongoing engagement.",
    ],
    quote:
      "These efforts align with the company's belief that education is a long-term investment in stronger communities.",
  },

  womenEmpowerment: {
    icon: "👩‍💼",
    title: "Women at the Core of Our Workforce",
    paragraphs: [
      "People are central to everything at Divyansh International, and women form a vital part of that foundation.",
      "The organisation maintains close, personal relationships with its women employees, creating a work environment that prioritises trust, respect, and continuity. Beyond providing employment, Divyansh International has nurtured a supportive community where women share experiences, encourage one another, and build confidence together.",
      "A dedicated digital platform allows women employees to voice their journeys and motivate each other to step into the workforce and sustain their careers. This initiative reflects the company's commitment to women empowerment and inclusive growth.",
    ],
  },

  childcareSection: {
    icon: "🧒",
    title: "Supporting Families Through Childcare and Learning",
    paragraphs: [
      "Understanding the realities faced by working mothers, Divyansh International has created a dedicated activity and learning centre for employees' children.",
      "This space includes supervised play areas for younger children and academic guidance through an assigned tutor. By providing this support, the organisation enables women employees to work with peace of mind while ensuring their children receive care and learning assistance in a safe environment.",
    ],
    highlight:
      "Such initiatives reinforce Divyansh International's employee-centric culture and commitment to work-life balance.",
  },

  industryCollaboration: {
    icon: "🤝",
    title: "Building Stronger Industry Communities",
    paragraphs: [
      "Divyansh International actively participates in industry-level collaboration through its association with a national trade council representing the nuts and dry fruits sector.",
      "By engaging in discussions, trade roadshows, and collective initiatives, the organisation contributes to addressing common industry challenges and promoting responsible trade practices.",
    ],
  },

  environmentalSection: {
    icon: "🌱",
    title: "Environmental Responsibility",
    introText: "Sustainability is integrated into the daily operations at Divyansh International.",
    initiatives: [
      { _key: "env-1", icon: "☀️", text: "Solar energy systems to reduce environmental footprint" },
      { _key: "env-2", icon: "💧", text: "Rainwater harvesting for responsible water usage" },
      { _key: "env-3", icon: "🏠", text: "Residential accommodation near workplace" },
      {
        _key: "env-4",
        icon: "🎓",
        text: "Partnerships with nearby schools for employees' children",
      },
    ],
  },

  tradeEventsSection: {
    title: "Trade Events & Exhibitions",
    subtitle: "Meet us at leading industry events across India",
  },

  tradeEvents: [
    {
      _key: "evt-1",
      name: "AAHAR International Food & Hospitality Fair",
      date: "2024-03-15",
      location: "New Delhi, India",
    },
    {
      _key: "evt-2",
      name: "India International Trade Fair",
      date: "2024-11-14",
      location: "Pragati Maidan, New Delhi",
    },
    {
      _key: "evt-3",
      name: "World Food India",
      date: "2024-09-20",
      location: "India",
    },
  ],

  closingMessage: {
    title: "Growing With Purpose",
    paragraphs: [
      "At Divyansh International, community responsibility is not a separate chapter from business—it is part of the same story.",
      "By supporting education, empowering women, caring for families, participating in industry dialogue, and investing in environmental sustainability, the organisation continues to grow with purpose, integrity, and empathy.",
    ],
    finalHighlight:
      "This is how Divyansh International builds long-term value—for its people, its partners, and the communities it serves.",
  },

  teamPhotos: [],
  csrInitiatives: [
    {
      _key: "csr-1",
      title: "Farmer Welfare Program",
      description:
        "Supporting almond and walnut farmers with fair pricing, training on sustainable practices, and direct procurement partnerships.",
    },
    {
      _key: "csr-2",
      title: "Local Employment",
      description:
        "Creating employment opportunities in Ludhiana and surrounding areas with focus on skill development and inclusive hiring.",
    },
    {
      _key: "csr-3",
      title: "Food Safety Education",
      description:
        "Conducting workshops on food safety standards and quality management for small-scale processors and traders.",
    },
  ],
};

const processSteps = [
  {
    _id: "1",
    title: "Sourcing & Procurement",
    detail:
      "Direct partnerships with certified growers across 15+ countries. Quality checks begin at origin with moisture, size, and defect analysis.",
    order: 1,
  },
  {
    _id: "2",
    title: "Import & Compliance",
    detail:
      "Full documentation, phytosanitary certificates, and customs clearance managed in-house for seamless import operations.",
    order: 2,
  },
  {
    _id: "3",
    title: "Processing & Grading",
    detail:
      "ISO-certified facility with daily cleaning, sorting, and custom grading. Size calibration, color sorting, and moisture control.",
    order: 3,
  },
  {
    _id: "4",
    title: "Quality Control",
    detail:
      "Multi-stage testing including visual inspection, lab analysis, and batch sampling to ensure consistent quality standards.",
    order: 4,
  },
  {
    _id: "5",
    title: "Packaging & Labeling",
    detail:
      "Flexible packaging options from bulk cartons to vacuum packs. Private label and custom branding available for B2B clients.",
    order: 5,
  },
  {
    _id: "6",
    title: "Distribution & Delivery",
    detail:
      "Pan-India logistics network with temperature-controlled storage. Fast dispatch to modern trade, HORECA, and institutional buyers.",
    order: 6,
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
  walkthrough: {
    subtitle: "Need Guidance?",
    title: "Schedule a Product Walkthrough",
    description:
      "Our team can guide you through our product range, packaging options, and pricing structures tailored to your business needs.",
    buttonText: "Book a Call",
  },
  pricing: {
    subtitle: "Get Wholesale Rates",
    title: "Request Bulk Pricing",
    description:
      "Share your requirements and receive competitive wholesale quotes for your institutional or trade procurement needs.",
    buttonText: "Get Quote",
    emailPlaceholder: "Enter your business email",
  },
};

const testimonialsSectionData = {
  _id: "testimonialsSection",
  _type: "testimonialsSection",
  eyebrow: "Client Testimonials",
  title: "Trusted by Leading Businesses",
  droneSection: {
    eyebrow: "Behind the Scenes",
    title: "Drone Diaries: Our Facility",
    placeholderText: "Aerial view of our processing facility",
    videoUrl: "",
    videos: [
      {
        _key: "facility-overview",
        title: "Facility Overview",
        description: "Aerial view of our ISO-certified processing facility in Mullapur, Ludhiana",
        videoUrl: "",
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
      "Serving 1000+ B2B clients across India",
    ],
    note: "Virtual tour coming soon",
  },
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

  header: {
    eyebrow: "Premium Dry Fruits and Nuts Importer & Supplier in India | Since 1999",
    title: "About Us",
    subtitle: "A Trusted Dry Fruits and Nuts Importer in India Since 1999",
  },

  openingStory: {
    title: "Every bag of dry fruits has a beginning.",
    highlight: "Ours began long before it had a name.",
    paragraphs: [
      "The story of Divyansh International is rooted in a family legacy built on trust, quality, and relationships. Long before Divyansh International was formally established in 1999, the foundations were laid by Mr. Som Nath Sethi, whose approach to the dry fruits and nuts business was guided by service rather than scale.",
      "After moving from Gujranwala to Ludhiana, he began working with dry fruits and nuts, slowly building a reputation for honesty and consistency. Customers didn't just come for quality almonds, cashews, anjeer, and other dry fruits. They returned because they felt valued.",
    ],
  },
  anjeerStory: {
    title: "A Memory That Defines Us",
    paragraphs: [
      "There's a memory that still defines the brand today. Children who accompanied their parents to the factory were always offered a piece of anjeer. A small, thoughtful gesture that quietly reflected what the business stood for: care beyond the transaction.",
      "That spirit continues to shape how Divyansh International works with customers, partners, and suppliers.",
    ],
  },
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
    b2b: {
      title: "B2B Excellence",
      names: ["Sethi Gold", "Sethi Mewa"],
      description: "Premium wholesale solutions",
    },
    d2c: {
      title: "Direct to Consumer",
      name: "The BetterNut.co",
      description: "Premium retail experience",
    },
  },
  productRangeSection: {
    title: "Premium Product Range",
    products: ["Almonds", "Walnuts", "Pistachios", "Makhana", "Desiccated Coconut Powder"],
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
      "Divyansh International is a premier importer, processor, and B2B distributor of high-quality dry fruits. With over two decades of experience, we have mastered the art of sourcing the finest nuts and dried fruits from around the globe. Our commitment goes beyond business; it's about building lasting relationships with our partners and consumers through transparency and consistent quality.",
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
  ],
  tradeButtonText: "Get Trade Quote",
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
    moqLabel: "MOQ:",
  },
  organization: {
    name: "Divyansh International",
    url: "https://www.divyanshinternational.com",
    logoUrl: "https://www.divyanshinternational.com/logo.png",
    description: "Leading importer, processor and B2B distributor of premium dry fruits in India.",
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
    siteUrl: "https://www.divyanshinternational.com",
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
    moqLabel: "MOQ",
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
      readyToSubmit: "Ready to submit? Get wholesale pricing and MOQ details.",
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
    tradeSubject: "New Trade Enquiry:",
    newTradeEnquiryTitle: "New Trade Enquiry",
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
    servingText:
      "Serving B2B dry fruit buyers across Punjab, North India and pan-India since 1999.",
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
      moq: "MOQ",
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
  tradeEnquiryLabel: "Trade / Bulk Enquiry",
  contactDetailsTitle: "Contact Details",
  businessHoursTitle: "Business Hours",
  footerNote: "Serving B2B dry fruit buyers across Punjab, North India and pan-India since 1999.",
  contactDetails: {
    address: "K-2, Kismat Complex, Miller Ganj, G.T. Road,\nLudhiana – 141003, Punjab, India",
    phone: ["+91-9878122400", "+91-161-4662156"],
    email: "Care@divyanshinternational.com",
  },
  businessHours: {
    weekdays: "Monday – Saturday: 9:00 AM – 6:00 PM",
    sunday: "Sunday: Closed",
  },
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
          children: [
            { _key: "span-5", _type: "span", text: "Process your trade enquiries and orders." },
          ],
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
      _key: "partners",
      value: "15+",
      label: "Global Partners",
      detail: "Sourcing from 15+ countries",
    },
    {
      _key: "quality",
      value: "100%",
      label: "Quality Guarantee",
      detail: "ISO 22000 & HACCP Certified",
    },
  ],
  capabilitiesSection: {
    eyebrow: "Capabilities",
    title: "Engineered touchpoints from farm gate to finished packs",
    description:
      "Every facility and partnership is designed for processor-grade traceability, institutional compliance, and private label readiness.",
    certificationsTitle: "Certified Excellence",
    certificationsDescription:
      "We adhere to the highest global standards of food safety and quality management.",
  },
  processSection: {
    eyebrow: "Process DNA",
    title: "Calibrated to institutional-grade precision",
    description:
      "Industrial discipline with family-run agility and personalized attention to every order.",
  },
  sustainabilitySection: {
    eyebrow: "Sustainability",
    title: "Building transparent supply chains with shared value",
    description:
      "We extend the value chain beyond procurement to farmer livelihoods, renewable operations, and inclusive hiring.",
  },
  trustSection: {
    eyebrow: "Partners & Certifications",
    title: "Compliance-ready for retailers, HoReCa, and export buyers",
    description:
      "We highlight globally accepted standards, retailer partnerships, and mission-critical certifications.",
    partnerSegments: [
      "Modern trade retail chains",
      "Institutional procurement desks",
      "HoReCa & hospitality groups",
      "Food processing & wellness brands",
    ],
  },
  productShowcaseSection: {
    eyebrow: "Product Programs",
    title: "Bulk dry fruit supply for trade, institutional and export buyers",
    description:
      "Preview our almond, walnut, pistachio, raisin and desiccated coconut programs built for dependable B2B sourcing. Each profile links to detailed specs and ready-to-share enquiry flows.",
  },
  spiralQuoteSection: {
    buttonText: "Discover Our Story",
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
          "Our advanced packaging systems and quality control measures for B2B and export requirements",
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
      title: "Leading importer, processor and B2B distributor of premium dry fruits in India",
      description:
        "Divyansh International is a leading importer, processor and B2B distributor of premium dry fruits in India, with a strong foothold across Punjab, North India and pan-India markets.",
      stats: [
        { _key: "years", value: "25+", label: "Years in Business" },
        { _key: "countries", value: "15+", label: "Countries Sourced" },
        { _key: "partners", value: "1000+", label: "B2B Partners" },
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
        "To become India's most reliable B2B dry fruits partner, known for integrity and excellence in supply.",
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

  const logoPath = path.join(process.cwd(), "public", "divyansh-logo.jpg");
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
      const doc = {
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
      };
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
    title: "Drone Diaries",
    note: "Experience our world-class facilities from above.",
    videos: [
      {
        _key: "vid1",
        title: "Facility Overview",
        description: "Aerial view of our processing facility",
        videoUrl: "",
      },
      {
        _key: "vid2",
        title: "Quality Control",
        description: "Our quality assurance processes",
        videoUrl: "",
      },
      {
        _key: "vid3",
        title: "Packaging Line",
        description: "State-of-the-art packaging systems",
        videoUrl: "",
      },
      {
        _key: "vid4",
        title: "Storage Facility",
        description: "Temperature-controlled storage",
        videoUrl: "",
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
  } else if (!currentSection.droneSection || !currentSection.droneSection.videos) {
    await client
      .patch(currentSection._id)
      .setIfMissing({ droneSection: droneSectionData })
      .commit();
  } else {
  }

  const regionNames = [
    { name: "Delhi NCR", lat: 28.6139, lng: 77.209, radius: 40000 },
    { name: "Punjab", lat: 31.1471, lng: 75.3412, radius: 70000 },
    { name: "Haryana", lat: 29.0588, lng: 76.0856, radius: 60000 },
  ];
  for (const region of regionNames) {
    const exists = await client.fetch('*[_type == "distributionRegion" && name == $name][0]', {
      name: region.name,
    });
    if (!exists) {
      await client.create({
        _type: "distributionRegion",
        name: region.name,
        description: `Active distribution region in ${region.name}`,
        lat: region.lat,
        lng: region.lng,
        radius: region.radius,
      });
    } else {
    }
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
