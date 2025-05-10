import React from "react";
import { Metadata } from "next";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import client from "@/tina/__generated__/client";

import "@/styles.css";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification=MW9pq279PQsnejsPOn6AG7syzHhmu3eZHLPoS0bpfRk';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GambleMentor Network: Top Crypto & Sweepstakes Casinos",
    template: "%s | GMBL",
  },
  description: "Discover top-rated crypto and sweepstakes casinos with expert reviews and exclusive bonuses.",
  keywords: ["GMBL", "Gamblementor","casinos","casino reviews","casino games","crypto casinos", "sweepstakes casinos", "online gambling", "bitcoin casinos", "casino bonuses","casino"],
  authors: [{ name: "GMBL Team" }],
  creator: "gamblementor.com",
  publisher: "gamblementor.com",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: baseUrl,
    title: "GambleMentor Network: Top Crypto & Sweepstakes Casinos",
    description: "Discover top-rated crypto and sweepstakes casinos with expert reviews and exclusive bonuses.",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Gamblementor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GambleMentor Network: Top Crypto & Sweepstakes Casinos",
    description: "Discover top-rated crypto and sweepstakes casinos with expert reviews and exclusive bonuses.",
    images: [`${baseUrl}/images/twitter-image.jpg`],
    creator: "@gamblementor",
  },
  verification: {
    google: googleSiteVerification,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': `${baseUrl}/en-US`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalQuery = await client.queries.global({
    relativePath: "index.json",
  });
  const global = globalQuery.data.global;

  const selectFont = (fontName: string | null | undefined) => {
    switch (fontName) {
      case "nunito":
        return `font-nunito ${nunito.variable}`;
      case "lato":
        return `font-lato ${lato.variable}`;
      case "sans":
      default:
        return `font-sans ${fontSans.variable} `;
    }
  };
  const fontVariable = selectFont(global.theme?.font);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* these are also defined in next.config.js but github pages doesn't support response headers */}
        {/* if you aren't deploying to github pages, feel free to delete these tags */}
        <script async src="https://tally.so/widgets/embed.js"></script>
        <meta name="X-Frame-Options" content="SAMEORIGIN" />
        <meta name="Content-Security-Policy" content="frame-ancestors 'self'" />
        <meta name="coinzilla" content="0439d786b8a3a98a26684cd7212ad775" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased",
          fontVariable
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 bg-[#f1f3f7]">
              {children}
            </main>
              <footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
