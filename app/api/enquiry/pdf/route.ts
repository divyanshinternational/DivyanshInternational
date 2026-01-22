"use server";

import { type NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { z } from "zod";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const enquiryItemSchema = z.object({
  productTitle: z.string().min(1),
  grade: z.string().optional(),
  packFormat: z.string().optional(),
  quantity: z.string().optional(),
  MOQ: z.string().optional(),
  notes: z.string().optional(),
});

const userDetailsSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const requestBodySchema = z.object({
  items: z.array(enquiryItemSchema).min(1),
  userDetails: userDetailsSchema.optional(),
});

// =============================================================================
// CMS CONFIGURATION SCHEMAS
// =============================================================================

const colorsSchema = z.object({
  deepBrown: z.string().optional(),
  gray: z.string().optional(),
  black: z.string().optional(),
  darkGray: z.string().optional(),
  gold: z.string().optional(),
  white: z.string().optional(),
  lightGray: z.string().optional(),
});

const stylingSchema = z.object({
  headerFontSize: z.number().optional(),
  subtitleFontSize: z.number().optional(),
  bodyFontSize: z.number().optional(),
  footerFontSize: z.number().optional(),
  tableFontSize: z.number().optional(),
  tableCellPadding: z.number().optional(),
  fontFamily: z.string().optional(),
  fontStyleNormal: z.string().optional(),
  fontStyleBold: z.string().optional(),
  tableTheme: z.string().optional(),
  columnWidths: z
    .object({
      index: z.number().optional(),
      product: z.number().optional(),
      grade: z.number().optional(),
      packFormat: z.number().optional(),
      quantity: z.number().optional(),
      moq: z.number().optional(),
      notes: z.number().optional(),
    })
    .optional(),
  colors: colorsSchema.optional(),
});

const tableHeadersSchema = z.object({
  product: z.string().optional(),
  grade: z.string().optional(),
  packFormat: z.string().optional(),
  quantity: z.string().optional(),
  moq: z.string().optional(),
  notes: z.string().optional(),
});

const pdfTemplateSchema = z.object({
  companyName: z.string().optional(),
  title: z.string().optional(),
  dateLabel: z.string().optional(),
  referenceLabel: z.string().optional(),
  referencePrefix: z.string().optional(),
  contactDetailsLabel: z.string().optional(),
  nameLabel: z.string().optional(),
  companyLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  phoneLabel: z.string().optional(),
  naText: z.string().optional(),
  emptyFieldText: z.string().optional(),
  indexLabel: z.string().optional(),
  footerText1: z.string().optional(),
  footerText2: z.string().optional(),
  filenamePrefix: z.string().optional(),
  tableHeaders: tableHeadersSchema.optional(),
  styling: stylingSchema.optional(),
});

const apiMessagesSchema = z.object({
  validationError: z.string().optional(),
  pdfGenerationError: z.string().optional(),
});

const siteSettingsSchema = z
  .object({
    apiMessages: apiMessagesSchema.optional(),
    pdfTemplate: pdfTemplateSchema.optional(),
  })
  .passthrough();

// =============================================================================
// DEFAULT FALLBACK VALUES
// =============================================================================

const DEFAULTS = {
  apiMessages: {
    validationError: "Please provide valid enquiry items.",
    pdfGenerationError: "Failed to generate PDF. Please try again.",
  },
  pdfTemplate: {
    companyName: "Divyansh International",
    title: "Enquiry Form",
    dateLabel: "Date:",
    referenceLabel: "Reference:",
    referencePrefix: "ENQ-",
    contactDetailsLabel: "Contact Details:",
    nameLabel: "Name:",
    companyLabel: "Company:",
    emailLabel: "Email:",
    phoneLabel: "Phone:",
    naText: "N/A",
    emptyFieldText: "-",
    indexLabel: "#",
    footerText1: "Thank you for your enquiry.",
    footerText2: "We will get back to you shortly.",
    filenamePrefix: "enquiry-",
    tableHeaders: {
      product: "Product",
      grade: "Grade",
      packFormat: "Pack Format",
      quantity: "Quantity",
      moq: "MOQ",
      notes: "Notes",
    },
    styling: {
      headerFontSize: 18,
      subtitleFontSize: 12,
      bodyFontSize: 10,
      footerFontSize: 8,
      tableFontSize: 9,
      tableCellPadding: 3,
      fontFamily: "helvetica",
      fontStyleNormal: "normal",
      fontStyleBold: "bold",
      tableTheme: "striped",
      columnWidths: {
        index: 10,
        product: 40,
        grade: 25,
        packFormat: 25,
        quantity: 25,
        moq: 20,
        notes: 35,
      },
      colors: {
        deepBrown: "91, 73, 51",
        gray: "128, 128, 128",
        black: "0, 0, 0",
        darkGray: "80, 80, 80",
        gold: "201, 164, 97",
        white: "255, 255, 255",
        lightGray: "180, 180, 180",
      },
    },
  },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parses RGB color string to tuple
 */
function parseColor(colorStr: string): [number, number, number] {
  const parts = colorStr.split(",").map((n) => parseInt(n.trim(), 10));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

/**
 * Sanitizes text for PDF output
 */
function sanitizeText(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 500);
}

/**
 * Gets configuration with fallbacks
 */
async function getConfig() {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[API PDF] Settings validation failed:", result.error.issues);
    }

    const settings = result.success ? result.data : null;
    const pdfTemplate = settings?.pdfTemplate;
    const styling = pdfTemplate?.styling;
    const colors = styling?.colors;

    return {
      apiMessages: {
        validationError:
          settings?.apiMessages?.validationError ?? DEFAULTS.apiMessages.validationError,
        pdfGenerationError:
          settings?.apiMessages?.pdfGenerationError ?? DEFAULTS.apiMessages.pdfGenerationError,
      },
      pdfTemplate: {
        companyName: pdfTemplate?.companyName ?? DEFAULTS.pdfTemplate.companyName,
        title: pdfTemplate?.title ?? DEFAULTS.pdfTemplate.title,
        dateLabel: pdfTemplate?.dateLabel ?? DEFAULTS.pdfTemplate.dateLabel,
        referenceLabel: pdfTemplate?.referenceLabel ?? DEFAULTS.pdfTemplate.referenceLabel,
        referencePrefix: pdfTemplate?.referencePrefix ?? DEFAULTS.pdfTemplate.referencePrefix,
        contactDetailsLabel:
          pdfTemplate?.contactDetailsLabel ?? DEFAULTS.pdfTemplate.contactDetailsLabel,
        nameLabel: pdfTemplate?.nameLabel ?? DEFAULTS.pdfTemplate.nameLabel,
        companyLabel: pdfTemplate?.companyLabel ?? DEFAULTS.pdfTemplate.companyLabel,
        emailLabel: pdfTemplate?.emailLabel ?? DEFAULTS.pdfTemplate.emailLabel,
        phoneLabel: pdfTemplate?.phoneLabel ?? DEFAULTS.pdfTemplate.phoneLabel,
        naText: pdfTemplate?.naText ?? DEFAULTS.pdfTemplate.naText,
        emptyFieldText: pdfTemplate?.emptyFieldText ?? DEFAULTS.pdfTemplate.emptyFieldText,
        indexLabel: pdfTemplate?.indexLabel ?? DEFAULTS.pdfTemplate.indexLabel,
        footerText1: pdfTemplate?.footerText1 ?? DEFAULTS.pdfTemplate.footerText1,
        footerText2: pdfTemplate?.footerText2 ?? DEFAULTS.pdfTemplate.footerText2,
        filenamePrefix: pdfTemplate?.filenamePrefix ?? DEFAULTS.pdfTemplate.filenamePrefix,
        tableHeaders: {
          product: pdfTemplate?.tableHeaders?.product ?? DEFAULTS.pdfTemplate.tableHeaders.product,
          grade: pdfTemplate?.tableHeaders?.grade ?? DEFAULTS.pdfTemplate.tableHeaders.grade,
          packFormat:
            pdfTemplate?.tableHeaders?.packFormat ?? DEFAULTS.pdfTemplate.tableHeaders.packFormat,
          quantity:
            pdfTemplate?.tableHeaders?.quantity ?? DEFAULTS.pdfTemplate.tableHeaders.quantity,
          moq: pdfTemplate?.tableHeaders?.moq ?? DEFAULTS.pdfTemplate.tableHeaders.moq,
          notes: pdfTemplate?.tableHeaders?.notes ?? DEFAULTS.pdfTemplate.tableHeaders.notes,
        },
      },
      styling: {
        headerFontSize: styling?.headerFontSize ?? DEFAULTS.pdfTemplate.styling.headerFontSize,
        subtitleFontSize:
          styling?.subtitleFontSize ?? DEFAULTS.pdfTemplate.styling.subtitleFontSize,
        bodyFontSize: styling?.bodyFontSize ?? DEFAULTS.pdfTemplate.styling.bodyFontSize,
        footerFontSize: styling?.footerFontSize ?? DEFAULTS.pdfTemplate.styling.footerFontSize,
        tableFontSize: styling?.tableFontSize ?? DEFAULTS.pdfTemplate.styling.tableFontSize,
        tableCellPadding:
          styling?.tableCellPadding ?? DEFAULTS.pdfTemplate.styling.tableCellPadding,
        fontFamily: styling?.fontFamily ?? DEFAULTS.pdfTemplate.styling.fontFamily,
        fontStyleNormal: styling?.fontStyleNormal ?? DEFAULTS.pdfTemplate.styling.fontStyleNormal,
        fontStyleBold: styling?.fontStyleBold ?? DEFAULTS.pdfTemplate.styling.fontStyleBold,
        tableTheme: styling?.tableTheme ?? DEFAULTS.pdfTemplate.styling.tableTheme,
        columnWidths: {
          index: styling?.columnWidths?.index ?? DEFAULTS.pdfTemplate.styling.columnWidths.index,
          product:
            styling?.columnWidths?.product ?? DEFAULTS.pdfTemplate.styling.columnWidths.product,
          grade: styling?.columnWidths?.grade ?? DEFAULTS.pdfTemplate.styling.columnWidths.grade,
          packFormat:
            styling?.columnWidths?.packFormat ??
            DEFAULTS.pdfTemplate.styling.columnWidths.packFormat,
          quantity:
            styling?.columnWidths?.quantity ?? DEFAULTS.pdfTemplate.styling.columnWidths.quantity,
          moq: styling?.columnWidths?.moq ?? DEFAULTS.pdfTemplate.styling.columnWidths.moq,
          notes: styling?.columnWidths?.notes ?? DEFAULTS.pdfTemplate.styling.columnWidths.notes,
        },
      },
      colors: {
        deepBrown: colors?.deepBrown ?? DEFAULTS.pdfTemplate.styling.colors.deepBrown,
        gray: colors?.gray ?? DEFAULTS.pdfTemplate.styling.colors.gray,
        black: colors?.black ?? DEFAULTS.pdfTemplate.styling.colors.black,
        darkGray: colors?.darkGray ?? DEFAULTS.pdfTemplate.styling.colors.darkGray,
        gold: colors?.gold ?? DEFAULTS.pdfTemplate.styling.colors.gold,
        white: colors?.white ?? DEFAULTS.pdfTemplate.styling.colors.white,
        lightGray: colors?.lightGray ?? DEFAULTS.pdfTemplate.styling.colors.lightGray,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API PDF] Failed to fetch config:", error);
    }
    return {
      apiMessages: DEFAULTS.apiMessages,
      pdfTemplate: DEFAULTS.pdfTemplate,
      styling: DEFAULTS.pdfTemplate.styling,
      colors: DEFAULTS.pdfTemplate.styling.colors,
    };
  }
}

// =============================================================================
// POST HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  const { apiMessages, pdfTemplate, styling, colors } = await getConfig();

  try {
    // Parse and validate request body
    const body: unknown = await request.json();
    const validation = requestBodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: apiMessages.validationError,
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { items, userDetails } = validation.data;

    // Generate unique reference ID
    const referenceId = `${pdfTemplate.referencePrefix}${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(styling.headerFontSize);
    doc.setTextColor(...parseColor(colors.deepBrown));
    doc.text(pdfTemplate.companyName, pageWidth / 2, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(styling.subtitleFontSize);
    doc.setTextColor(...parseColor(colors.gray));
    doc.text(pdfTemplate.title, pageWidth / 2, 28, { align: "center" });

    // Date and Reference
    doc.setFontSize(styling.bodyFontSize);
    doc.setTextColor(...parseColor(colors.black));
    doc.text(`${pdfTemplate.dateLabel} ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`${pdfTemplate.referenceLabel} ${referenceId}`, 14, 45);

    // User details section
    let startY = 55;
    if (userDetails) {
      doc.text(pdfTemplate.contactDetailsLabel, 14, startY);
      doc.setFont(styling.fontFamily, styling.fontStyleNormal);
      doc.setTextColor(...parseColor(colors.darkGray));

      const details = [
        userDetails.name && `${pdfTemplate.nameLabel} ${sanitizeText(userDetails.name)}`,
        userDetails.company && `${pdfTemplate.companyLabel} ${sanitizeText(userDetails.company)}`,
        userDetails.email && `${pdfTemplate.emailLabel} ${sanitizeText(userDetails.email)}`,
        userDetails.phone && `${pdfTemplate.phoneLabel} ${sanitizeText(userDetails.phone)}`,
      ].filter(Boolean);

      details.forEach((detail, index) => {
        doc.text(detail as string, 14, startY + 5 + index * 5);
      });

      startY += 10 + details.length * 5;
    }

    // Table data (sanitized)
    const tableData = items.map((item, index) => [
      index + 1,
      sanitizeText(item.productTitle) || pdfTemplate.naText,
      sanitizeText(item.grade) || pdfTemplate.emptyFieldText,
      sanitizeText(item.packFormat) || pdfTemplate.emptyFieldText,
      sanitizeText(item.quantity) || pdfTemplate.emptyFieldText,
      sanitizeText(item.MOQ) || pdfTemplate.emptyFieldText,
      sanitizeText(item.notes) || pdfTemplate.emptyFieldText,
    ]);

    const headers = pdfTemplate.tableHeaders;
    const colWidths = styling.columnWidths;

    // Generate table
    autoTable(doc, {
      startY: startY,
      head: [
        [
          pdfTemplate.indexLabel,
          headers.product,
          headers.grade,
          headers.packFormat,
          headers.quantity,
          headers.moq,
          headers.notes,
        ],
      ],
      body: tableData,
      theme: styling.tableTheme as "striped" | "grid" | "plain",
      headStyles: {
        fillColor: parseColor(colors.gold),
        textColor: parseColor(colors.white),
        fontStyle: styling.fontStyleBold as "bold" | "normal" | "italic",
      },
      styles: {
        fontSize: styling.tableFontSize,
        cellPadding: styling.tableCellPadding,
      },
      columnStyles: {
        0: { cellWidth: colWidths.index },
        1: { cellWidth: colWidths.product },
        2: { cellWidth: colWidths.grade },
        3: { cellWidth: colWidths.packFormat },
        4: { cellWidth: colWidths.quantity },
        5: { cellWidth: colWidths.moq },
        6: { cellWidth: colWidths.notes },
      },
    });

    // Footer
    const finalY =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || startY;
    doc.setFontSize(styling.footerFontSize);
    doc.setTextColor(...parseColor(colors.lightGray));
    doc.text(pdfTemplate.footerText1, pageWidth / 2, finalY + 15, { align: "center" });
    doc.text(pdfTemplate.footerText2, pageWidth / 2, finalY + 20, { align: "center" });

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfTemplate.filenamePrefix}${referenceId}.pdf"`,
      },
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API PDF] Generation error:", error);
    }
    return NextResponse.json(
      { success: false, error: apiMessages.pdfGenerationError },
      { status: 500 }
    );
  }
}
