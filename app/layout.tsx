import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuoteGenie - Discover Inspiring Quotes",
  description: "Discover profound wisdom and inspiration with QuoteGenie. Generate personalized quotes that resonate with your soul on topics like motivation, success, love, and more.",
  keywords: ["quotes", "inspiration", "motivation", "wisdom", "success", "life quotes", "famous quotes", "nexium"],
  authors: [{ name: "Nexium Global", url: "https://www.nexium.ltd" }],
  creator: "Nexium Global",
  publisher: "Nexium Global",
  metadataBase: new URL("https://nexium-hamza-salam-assign1.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexium-hamza-salam-assign1.vercel.app",
    title: "QuoteGenie - Discover Inspiring Quotes",
    description: "Generate personalized quotes that resonate with your soul. Find wisdom on motivation, success, love, and more.",
    siteName: "QuoteGenie",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteGenie - Discover Inspiring Quotes",
    description: "Generate personalized quotes that resonate with your soul.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nexium-hamza-salam-assign1.vercel.app",
  },
  category: "productivity",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="bottom-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
