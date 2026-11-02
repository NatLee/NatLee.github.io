import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteGate } from "@/components/stock/SiteGate";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Static title only; SiteGate prefixes the profile name once /content/site.json has loaded.
export const metadata: Metadata = {
  title: "Stonk theme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-stock-bg text-stock-text antialiased`}>
        <SiteGate>{children}</SiteGate>
      </body>
    </html>
  );
}
