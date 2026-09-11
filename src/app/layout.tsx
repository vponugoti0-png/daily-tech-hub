import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDigest } from "@/lib/content";
import { formatDateTime } from "@/lib/dates";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Daily Tech Hub",
    template: "%s · Daily Tech Hub",
  },
  description:
    "Personal daily tech hub for data engineers — Snowflake, Databricks, Python, and PySpark news, training, releases, and shortcuts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const digest = getDigest();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <Footer lastUpdated={formatDateTime(digest.lastUpdated)} />
      </body>
    </html>
  );
}
