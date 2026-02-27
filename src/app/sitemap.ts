import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient();

  const [гайды, инструменты, страницы, вопросы, посты, теги, фреймворки] =
    await Promise.all([
      payload.find({
        collection: "guides",
        where: { status: { equals: "published" } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: "tools",
        where: { status: { equals: "published" } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: "pages",
        limit: 100,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: "questions",
        where: { status: { in: ["published", "closed"] } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: "posts",
        where: { status: { equals: "published" } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: "tags",
        limit: 500,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: "frameworks",
        where: { status: { equals: "published" } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
      }),
    ]);

  const статичные: MetadataRoute.Sitemap = [
    { url: САЙТ_URL, changeFrequency: "daily", priority: 1 },
    { url: `${САЙТ_URL}/path`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${САЙТ_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${САЙТ_URL}/questions`, changeFrequency: "daily", priority: 0.9 },
    { url: `${САЙТ_URL}/framework`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${САЙТ_URL}/posts`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${САЙТ_URL}/search`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const гайдыUrlы: MetadataRoute.Sitemap = гайды.docs.map((г) => ({
    url: `${САЙТ_URL}/path/${г.slug}`,
    lastModified: г.updatedAt ? new Date(г.updatedAt as string) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const инструментыUrlы: MetadataRoute.Sitemap = инструменты.docs.map((и) => ({
    url: `${САЙТ_URL}/tools/${и.slug}`,
    lastModified: и.updatedAt ? new Date(и.updatedAt as string) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const вопросыUrlы: MetadataRoute.Sitemap = вопросы.docs.map((в) => ({
    url: `${САЙТ_URL}/questions/${в.slug}`,
    lastModified: в.updatedAt ? new Date(в.updatedAt as string) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const постыUrlы: MetadataRoute.Sitemap = посты.docs.map((п) => ({
    url: `${САЙТ_URL}/posts/${п.slug}`,
    lastModified: п.updatedAt ? new Date(п.updatedAt as string) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const тегиUrlы: MetadataRoute.Sitemap = теги.docs.map((т) => ({
    url: `${САЙТ_URL}/tags/${т.slug}`,
    lastModified: т.updatedAt ? new Date(т.updatedAt as string) : undefined,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const фреймворкиUrlы: MetadataRoute.Sitemap = фреймворки.docs.map((ф) => ({
    url: `${САЙТ_URL}/framework/${ф.slug}`,
    lastModified: ф.updatedAt ? new Date(ф.updatedAt as string) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const страницыUrlы: MetadataRoute.Sitemap = страницы.docs
    .filter((с) => с.slug !== "framework")
    .map((с) => ({
      url: `${САЙТ_URL}/${с.slug}`,
      lastModified: с.updatedAt ? new Date(с.updatedAt as string) : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [
    ...статичные,
    ...гайдыUrlы,
    ...инструментыUrlы,
    ...вопросыUrlы,
    ...постыUrlы,
    ...тегиUrlы,
    ...фреймворкиUrlы,
    ...страницыUrlы,
  ];
}
