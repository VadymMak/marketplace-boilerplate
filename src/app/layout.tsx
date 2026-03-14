import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || "Marketplace",
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "Marketplace"}`,
  },
  description: "A modern marketplace built with Next.js",
  openGraph: {
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          <Header />
          <main style={{ minHeight: "calc(100vh - var(--header-height))" }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
