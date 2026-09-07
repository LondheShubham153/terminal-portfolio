import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const title = post.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0b0d0e",
          color: "#d7dce0",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 26, color: "#7fffa1", marginBottom: 24 }}>$ cat {slug}.md</div>
        <div style={{ fontSize: 60, fontWeight: 700, color: "#d7dce0", lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 24, color: "#7a838a", marginTop: 40 }}>{SITE_NAME} — Blog</div>
      </div>
    ),
    { ...size },
  );
}
