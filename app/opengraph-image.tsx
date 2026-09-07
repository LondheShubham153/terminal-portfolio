import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
        <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#e8534d" }} />
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#e8a33d" }} />
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#7fffa1" }} />
        </div>
        <div style={{ fontSize: 30, color: "#7fffa1" }}>shubham@portfolio:~$ whoami</div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#d7dce0", marginTop: 16 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 28, color: "#7a838a", marginTop: 24, maxWidth: 900 }}>{SITE_DESCRIPTION}</div>
      </div>
    ),
    { ...size },
  );
}
