import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.esteemwears.in";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2026-04-28T15:33:57+00:00"),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-04-28T15:33:57+00:00"),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date("2026-04-28T15:33:57+00:00"),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/catalogue/boys`,
      lastModified: new Date("2026-04-28T15:33:57+00:00"),
      priority: 0.64,
    },
    {
      url: `${baseUrl}/catalogue/girls`,
      lastModified: new Date("2026-04-28T15:33:57+00:00"),
      priority: 0.64,
    },
    {
      url: `${baseUrl}/catalogue/men`,
      lastModified: new Date("2026-04-28T15:33:57+00:00"),
      priority: 0.64,
    },
  ];
}
