import { db } from "./db";

export function getProjects() {
  return db.project.findMany({ orderBy: { order: "asc" } });
}

export function getProjectBySlug(slug: string) {
  return db.project.findUnique({ where: { slug } });
}

export function getSkills() {
  return db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
}

export function getExperience() {
  return db.experience.findMany({ orderBy: { order: "asc" } });
}

export function getTestimonials() {
  return db.testimonial.findMany({ orderBy: { order: "asc" } });
}

export function getPublishedPosts() {
  return db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export function getPostBySlug(slug: string) {
  return db.blogPost.findFirst({ where: { slug, published: true } });
}

export function getActiveResume() {
  return db.resume.findFirst({ where: { isActive: true }, orderBy: { uploadedAt: "desc" } });
}
