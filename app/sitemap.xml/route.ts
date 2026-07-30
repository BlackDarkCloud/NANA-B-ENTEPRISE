import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const staticPages = [
    { path: "", priority: "1.0", frequency: "daily" },
    { path: "/category/home-appliances", priority: "0.8", frequency: "weekly" },
    { path: "/category/kitchen-dining", priority: "0.8", frequency: "weekly" },
    { path: "/category/lifestyle", priority: "0.8", frequency: "weekly" },
  ];

  let products: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // Keep the core sitemap available if the database is temporarily sleeping.
  }

  const urls = [
    ...staticPages.map(
      (page) => `<url>
  <loc>${escapeXml(`${baseUrl}${page.path}`)}</loc>
  <changefreq>${page.frequency}</changefreq>
  <priority>${page.priority}</priority>
</url>`,
    ),
    ...products.map(
      (product) => `<url>
  <loc>${escapeXml(`${baseUrl}/products/${product.slug}`)}</loc>
  <lastmod>${product.updatedAt.toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`,
    ),
  ].join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
