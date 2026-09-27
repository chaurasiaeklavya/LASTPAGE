import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: new URL("/", base).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/brand", base).toString(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
