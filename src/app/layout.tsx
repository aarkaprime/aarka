import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstateIQ — AI-Powered Real Estate API for Africa",
  description:
    "Generate property descriptions, social media content, WhatsApp messages, and more through one powerful API. Build your real estate app in hours, not months.",
  keywords: [
    "EstateIQ",
    "real estate API",
    "Africa",
    "AI content generation",
    "property management",
    "developer API",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-zinc-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
