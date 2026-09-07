const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const raw = process.env.SITE_URL;
  if (!raw) return FALLBACK_SITE_URL;
  try {
    new URL(raw);
    return raw;
  } catch {
    console.error(`SITE_URL "${raw}" is not a valid URL — falling back to ${FALLBACK_SITE_URL}`);
    return FALLBACK_SITE_URL;
  }
}

/** Canonical site URL for absolute links in metadata, sitemap, and OG images. */
export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Shubham Londhe";
export const SITE_DESCRIPTION = "Portfolio of Shubham Londhe: projects, writing, and experience.";
