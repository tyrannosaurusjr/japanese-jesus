import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://japanesejesus.com";
const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;
export const SITE_URL = siteUrl;

const SITE_NAME = "Japanese Jesus";
const DEFAULT_IMAGE = "/images/og/home-sigil.jpg";
const DEFAULT_IMAGE_ALT = "The Japanese Jesus sigil centered in a gray field";
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;
const OG_IMAGE_VERSION = "20260309";

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  robots?: Metadata["robots"];
}

function normalizePath(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
}

function withOgImageVersion(pathOrUrl: string) {
  if (!pathOrUrl.includes("/images/og/")) {
    return pathOrUrl;
  }

  if (/[?&]v=/.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const separator = pathOrUrl.includes("?") ? "&" : "?";
  return `${pathOrUrl}${separator}v=${OG_IMAGE_VERSION}`;
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = normalizePath(pathOrUrl);
  return `${siteUrl}${normalizedPath}`;
}

function toDescription(text: string, maxLength = 180) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  canonical,
  keywords,
  image = DEFAULT_IMAGE,
  imageWidth,
  imageHeight,
  imageAlt = DEFAULT_IMAGE_ALT,
  robots,
}: BuildPageMetadataInput): Metadata {
  const cleanDescription = toDescription(description);
  const normalizedPath = normalizePath(path);
  const canonicalPath = normalizePath(canonical ?? normalizedPath);
  const imageUrl = toAbsoluteUrl(withOgImageVersion(image));
  const resolvedImageWidth =
    imageWidth ?? (image === DEFAULT_IMAGE ? DEFAULT_IMAGE_WIDTH : undefined);
  const resolvedImageHeight =
    imageHeight ?? (image === DEFAULT_IMAGE ? DEFAULT_IMAGE_HEIGHT : undefined);

  const openGraphImage = {
    url: imageUrl,
    alt: imageAlt,
    ...(resolvedImageWidth ? { width: resolvedImageWidth } : {}),
    ...(resolvedImageHeight ? { height: resolvedImageHeight } : {}),
  };

  const twitterImage = {
    url: imageUrl,
    alt: imageAlt,
  };

  return {
    title,
    description: cleanDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    robots,
    openGraph: {
      title,
      description: cleanDescription,
      url: toAbsoluteUrl(normalizedPath),
      siteName: SITE_NAME,
      type: "website",
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [twitterImage],
    },
  };
}
