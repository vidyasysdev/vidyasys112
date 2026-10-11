import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vidyasys.vercel.app";

  const publicRoutes = [
    "",
    "/about",
    "/how-it-works",
    "/explore",
    "/tutors",
    "/contact",
    "/login",
    "/signup",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
