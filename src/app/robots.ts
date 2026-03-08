import type { MetadataRoute } from "next";

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/search",
          "/tools/create",
          "/posts/new",
          "/questions/ask",
          "/framework/create",
        ],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/search",
          "/tools/create",
          "/posts/new",
          "/questions/ask",
          "/framework/create",
        ],
      },
    ],
    sitemap: `${САЙТ_URL}/sitemap.xml`,
    host: САЙТ_URL,
  };
}
