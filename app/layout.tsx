import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Shubham Londhe — Software Engineer",
  description: "Portfolio of Shubham Londhe: projects, writing, and experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mono.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-term-bg text-term-fg font-serif">
        {children}
      </body>
    </html>
  );
}
