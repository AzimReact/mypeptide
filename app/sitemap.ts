import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/faq",
  "/about",
  "/contact",
  "/quality",
  "/research-use",
  "/terms",
  "/privacy",
  "/shipping",
  "/refund",
  "/track-order",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
