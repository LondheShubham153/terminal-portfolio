import { NextRequest, NextResponse } from "next/server";
import { getActiveResume } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const resume = await getActiveResume();
  if (!resume) {
    return NextResponse.json({ error: "No resume uploaded yet." }, { status: 404 });
  }
  const target = new URL(resume.fileUrl, request.url);
  return NextResponse.redirect(target);
}
