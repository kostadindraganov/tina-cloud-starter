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

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TinaApp",
    template: "%s | TinaApp",
  },
  description: "A Next.js site powered by TinaCMS",
  keywords: ["Next.js", "TinaCMS", "React", "Content Management"],
  authors: [{ name: "TinaApp Team" }],
  creator: "gamblementor",
  publisher: "gamblementor",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "gamblementor.com",
    title: "gamblementor",
    description: "A Next.js site powered by TinaCMS",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TinaApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TinaApp",
    description: "A Next.js site powered by TinaCMS",
    images: [`${baseUrl}/images/twitter-image.jpg`],
    creator: "@gamblementor",
  },
  verification: {
    google: "google-site-verification-code",
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
            <footer className="py-6 border-t border-[hsl(var(--border))]">
              <div className="layout-container">
                <div className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                  © {new Date().getFullYear()} gamblementor. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
