import type { MetadataRoute } from "next";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH, CONDUIT_NOTES } from "@/lib/site-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://japanesejesus.com";

const CORE_ROUTES = ["/", "/canon", "/canon/game", "/conduit", "/journey", "/relics", "/signal"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = CORE_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const canonEpochEntries: MetadataRoute.Sitemap = CANON_EPOCHS.map((epoch) => ({
    url: `${siteUrl}/canon/${epoch.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const canonSeriesEntries: MetadataRoute.Sitemap = Object.entries(CANON_SERIES_BY_EPOCH).flatMap(
    ([epochSlug, entries]) =>
      (entries ?? []).map((entry) => ({
        url: `${siteUrl}/canon/${epochSlug}/${entry.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  const conduitEntries: MetadataRoute.Sitemap = CONDUIT_NOTES.map((note) => ({
    url: `${siteUrl}/conduit/${note.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...canonEpochEntries, ...canonSeriesEntries, ...conduitEntries];
}
