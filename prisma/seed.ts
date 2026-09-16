import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateProductArtSvg } from "../lib/placeholder-art";
import { createSimplePdf } from "../lib/pdf";

const prisma = new PrismaClient();

const UPLOAD_PRODUCTS_DIR = path.join(process.cwd(), "public", "uploads", "products");
const UPLOAD_DOCUMENTS_DIR = path.join(process.cwd(), "public", "uploads", "documents");

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
}

interface ProductSeed {
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  shortDescription: string;
  description: string;
  specifications: { label: string; value: string }[];
  stock: number;
  active: boolean;
  featured: boolean;
  fillLevel: number;
}

const categories: CategorySeed[] = [
  {
    name: "Peptide Compounds",
    slug: "peptide-compounds",
    description:
      "Lyophilized reference peptide compounds, synthesized and tested for laboratory research applications.",
  },
  {
    name: "Research Reagents",
    slug: "research-reagents",
    description:
      "Buffers, solvents, and reconstitution reagents used to support in-vitro research workflows.",
  },
  {
    name: "Reference Standards",
    slug: "reference-standards",
    description:
      "Analytical reference standards intended for calibration and comparative research use.",
  },
  {
    name: "Lab Consumables",
    slug: "lab-consumables",
    description:
      "Sterile vials, precision syringes, and other consumables used to support laboratory handling.",
  },
];

const baseSpecs = (overrides: Record<string, string> = {}) => [
  { label: "Purity (HPLC)", value: overrides.purity ?? "≥ 98%" },
  { label: "Form", value: overrides.form ?? "Lyophilized powder" },
  { label: "Molecular Weight", value: overrides.mw ?? "1,203.4 g/mol" },
  { label: "Storage", value: overrides.storage ?? "-20°C, protect from light" },
  { label: "Packaging", value: overrides.packaging ?? "Single-use glass vial" },
  { label: "Batch Testing", value: overrides.batch ?? "Third-party HPLC & MS verified" },
];

const products: ProductSeed[] = [
  {
    name: "AX-1102 Research Compound",
    slug: "ax-1102-research-compound",
    sku: "AX-1102-5",
    price: 8900,
    categorySlug: "peptide-compounds",
    shortDescription: "5mg lyophilized reference compound for in-vitro research.",
    description:
      "AX-1102 is a lyophilized reference compound manufactured for laboratory research applications. Each batch is synthesized under controlled conditions and independently verified for purity prior to release. Supplied as a single-use vial, intended strictly for qualified research use.",
    specifications: baseSpecs({ mw: "1,048.2 g/mol" }),
    stock: 42,
    active: true,
    featured: true,
    fillLevel: 0.6,
  },
  {
    name: "AX-1140 Research Compound",
    slug: "ax-1140-research-compound",
    sku: "AX-1140-10",
    price: 12900,
    categorySlug: "peptide-compounds",
    shortDescription: "10mg lyophilized reference compound, high-purity synthesis.",
    description:
      "AX-1140 is produced via solid-phase synthesis and finished as a lyophilized powder for research stability. Documentation for each lot, including chromatography summaries, is available on request for verification purposes.",
    specifications: baseSpecs({ mw: "1,419.6 g/mol" }),
    stock: 30,
    active: true,
    featured: true,
    fillLevel: 0.72,
  },
  {
    name: "AX-2207 Research Compound",
    slug: "ax-2207-research-compound",
    sku: "AX-2207-5",
    price: 9900,
    categorySlug: "peptide-compounds",
    shortDescription: "5mg reference compound with independent batch verification.",
    description:
      "AX-2207 is formulated for laboratory reference use and shipped with cold-chain packaging recommendations. Every production lot is assigned a traceable batch number tied to its analytical documentation.",
    specifications: baseSpecs({ mw: "962.1 g/mol" }),
    stock: 25,
    active: true,
    featured: false,
    fillLevel: 0.55,
  },
  {
    name: "AX-2290 Research Compound",
    slug: "ax-2290-research-compound",
    sku: "AX-2290-10",
    price: 14900,
    compareAtPrice: 16900,
    categorySlug: "peptide-compounds",
    shortDescription: "10mg high-purity compound for comparative research studies.",
    description:
      "AX-2290 is a higher-yield formulation intended for extended research protocols requiring larger reference quantities. Purity is confirmed through independent HPLC analysis prior to batch release.",
    specifications: baseSpecs({ mw: "1,588.9 g/mol", purity: "≥ 99%" }),
    stock: 18,
    active: true,
    featured: true,
    fillLevel: 0.8,
  },
  {
    name: "AX-3315 Research Compound",
    slug: "ax-3315-research-compound",
    sku: "AX-3315-2",
    price: 6900,
    categorySlug: "peptide-compounds",
    shortDescription: "2mg compact reference compound, ideal for pilot studies.",
    description:
      "AX-3315 is packaged in a compact 2mg format suited for pilot-scale research and assay development. Like all Axiom Research compounds, it ships with lot-specific documentation available for download.",
    specifications: baseSpecs({ mw: "845.7 g/mol" }),
    stock: 60,
    active: true,
    featured: false,
    fillLevel: 0.4,
  },
  {
    name: "AX-4420 Research Compound",
    slug: "ax-4420-research-compound",
    sku: "AX-4420-5",
    price: 10900,
    categorySlug: "peptide-compounds",
    shortDescription: "5mg reference compound with extended stability profile.",
    description:
      "AX-4420 has been formulated with a focus on shelf stability under standard laboratory freezer conditions. Recommended for research teams running multi-week comparative protocols.",
    specifications: baseSpecs({ mw: "1,132.5 g/mol" }),
    stock: 8,
    active: true,
    featured: false,
    fillLevel: 0.5,
  },
  {
    name: "RC-410 Buffer Solution",
    slug: "rc-410-buffer-solution",
    sku: "RC-410-30",
    price: 3400,
    categorySlug: "research-reagents",
    shortDescription: "30mL sterile-filtered buffer for reconstitution workflows.",
    description:
      "RC-410 is a sterile-filtered buffer solution formulated to support consistent reconstitution across research protocols. Manufactured in small batches with lot-level quality documentation.",
    specifications: baseSpecs({
      purity: "USP-grade",
      form: "Sterile liquid",
      mw: "N/A — solution",
      packaging: "30mL amber glass bottle",
    }),
    stock: 75,
    active: true,
    featured: false,
    fillLevel: 0.85,
  },
  {
    name: "RC-455 Reconstitution Solvent",
    slug: "rc-455-reconstitution-solvent",
    sku: "RC-455-30",
    price: 2900,
    categorySlug: "research-reagents",
    shortDescription: "30mL bacteriostatic-grade solvent for laboratory use.",
    description:
      "RC-455 is a bacteriostatic-grade solvent intended to support consistent handling of lyophilized reference materials in laboratory settings. Not for human or veterinary administration.",
    specifications: baseSpecs({
      purity: "USP-grade",
      form: "Sterile liquid",
      mw: "N/A — solution",
      packaging: "30mL amber glass bottle",
    }),
    stock: 90,
    active: true,
    featured: true,
    fillLevel: 0.9,
  },
  {
    name: "RS-500 Reference Standard",
    slug: "rs-500-reference-standard",
    sku: "RS-500-1",
    price: 15900,
    categorySlug: "reference-standards",
    shortDescription: "1mg certified reference standard for analytical calibration.",
    description:
      "RS-500 is an analytical reference standard intended for use in calibration and comparative testing workflows. Supplied with a certificate of analysis detailing identity and purity verification.",
    specifications: baseSpecs({ purity: "≥ 99.5%", mw: "1,276.3 g/mol" }),
    stock: 20,
    active: true,
    featured: false,
    fillLevel: 0.35,
  },
  {
    name: "RS-512 Reference Standard",
    slug: "rs-512-reference-standard",
    sku: "RS-512-1",
    price: 17900,
    categorySlug: "reference-standards",
    shortDescription: "1mg reference standard with extended analytical panel.",
    description:
      "RS-512 ships with an extended analytical panel, including mass spectrometry confirmation alongside standard HPLC purity data, for research teams requiring additional verification depth.",
    specifications: baseSpecs({ purity: "≥ 99.5%", mw: "1,401.8 g/mol" }),
    stock: 0,
    active: true,
    featured: false,
    fillLevel: 0.3,
  },
  {
    name: "LC-100 Sterile Vial Kit",
    slug: "lc-100-sterile-vial-kit",
    sku: "LC-100-10",
    price: 2200,
    categorySlug: "lab-consumables",
    shortDescription: "Pack of 10 sterile glass vials for laboratory handling.",
    description:
      "A pack of 10 sterile, single-use glass vials designed for laboratory handling and short-term storage of research materials. Each vial is individually sealed prior to packaging.",
    specifications: baseSpecs({
      purity: "N/A — consumable",
      form: "Sterile glass vial",
      mw: "N/A",
      packaging: "Pack of 10",
      batch: "Visual and seal-integrity inspected",
    }),
    stock: 120,
    active: true,
    featured: false,
    fillLevel: 0.2,
  },
  {
    name: "LC-120 Precision Syringe Kit",
    slug: "lc-120-precision-syringe-kit",
    sku: "LC-120-20",
    price: 1900,
    categorySlug: "lab-consumables",
    shortDescription: "Pack of 20 precision-graduated syringes for lab measurement.",
    description:
      "A pack of 20 individually wrapped precision-graduated syringes intended for accurate laboratory-scale liquid measurement during research protocols. Sterile until opened.",
    specifications: baseSpecs({
      purity: "N/A — consumable",
      form: "Sterile syringe",
      mw: "N/A",
      packaging: "Pack of 20",
      batch: "Visual and seal-integrity inspected",
    }),
    stock: 200,
    active: true,
    featured: false,
    fillLevel: 0.15,
  },
];

async function ensureUploadDirs() {
  await mkdir(UPLOAD_PRODUCTS_DIR, { recursive: true });
  await mkdir(UPLOAD_DOCUMENTS_DIR, { recursive: true });
}

async function writeProductArt(slug: string, sku: string, seed: number, fillLevel: number) {
  const svg = generateProductArtSvg({ code: sku, seed, fillLevel });
  const filename = `${slug}.svg`;
  await writeFile(path.join(UPLOAD_PRODUCTS_DIR, filename), svg, "utf-8");
  return `/uploads/products/${filename}`;
}

async function writeProductDocuments(slug: string, name: string, sku: string) {
  const coa = createSimplePdf(`Certificate of Analysis - ${name}`, [
    `SKU: ${sku}`,
    `Batch: LOT-${Math.floor(Math.random() * 90000 + 10000)}`,
    "Test method: HPLC / Mass Spectrometry",
    "Result: Conforms to specification",
    "",
    "This document is a placeholder generated for demonstration",
    "purposes only and does not represent a real laboratory analysis.",
  ]);
  const sds = createSimplePdf(`Safety Data Sheet - ${name}`, [
    `SKU: ${sku}`,
    "For laboratory / research use only.",
    "Not for human or veterinary use.",
    "Handle using standard laboratory PPE and procedures.",
    "",
    "This document is a placeholder generated for demonstration",
    "purposes only and does not represent a real safety data sheet.",
  ]);

  const coaFilename = `${slug}-coa.pdf`;
  const sdsFilename = `${slug}-sds.pdf`;
  await writeFile(path.join(UPLOAD_DOCUMENTS_DIR, coaFilename), coa);
  await writeFile(path.join(UPLOAD_DOCUMENTS_DIR, sdsFilename), sds);

  return [
    { type: "COA", title: "Certificate of Analysis", url: `/uploads/documents/${coaFilename}` },
    { type: "SDS", title: "Safety Data Sheet", url: `/uploads/documents/${sdsFilename}` },
  ];
}

async function main() {
  await ensureUploadDirs();

  console.log("Seeding categories…");
  const categoryRecords = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        description: category.description,
      },
    });
    categoryRecords.set(category.slug, record.id);
  }

  console.log("Seeding products…");
  for (const [index, product] of products.entries()) {
    const categoryId = categoryRecords.get(product.categorySlug);
    if (!categoryId) throw new Error(`Unknown category slug: ${product.categorySlug}`);

    const imageUrl = await writeProductArt(product.slug, product.sku, index, product.fillLevel);
    const documents = await writeProductDocuments(product.slug, product.name, product.sku);

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        categoryId,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: JSON.stringify(product.specifications),
        stock: product.stock,
        active: product.active,
        featured: product.featured,
        images: { create: [{ url: imageUrl, alt: product.name, position: 0 }] },
        documents: { create: documents },
      },
      update: {
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        categoryId,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: JSON.stringify(product.specifications),
        stock: product.stock,
        active: product.active,
        featured: product.featured,
      },
    });
  }

  console.log("Seeding admin user…");
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@veridianlabs.demo";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe!2024";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Axiom Admin",
      role: "admin",
    },
    update: {
      passwordHash,
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / (password from .env)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
