import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPublishedPosts, getProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getProjects()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Projects and posts both surface on the homepage (sections + latest-post
  // links), so either updating should bump its freshness signal.
  const latestUpdate = [...projects, ...posts].reduce<Date | undefined>((latest, item) => {
    const candidate = item.updatedAt;
    if (!latest || candidate > latest) return candidate;
    return latest;
  }, undefined);

  if (latestUpdate) {
    staticRoutes[0].lastModified = latestUpdate;
  }

  return [...staticRoutes, ...postRoutes];
}
