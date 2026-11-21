import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `${siteConfig.businessName} — Servis HP & Booking Online`,
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: { icon: "/logo-dokter-ponsel-jogja.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
