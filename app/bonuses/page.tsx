import React from "react";
import Layout from "@/components/layout/layout";
import BonusesClientPage from "./client-page";

import { Metadata } from "next";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Exclusive Casino Bonuses – GambleMentor Network",
    template: "%s | GMBL",
  },
  description: "Access the latest bonuses for crypto and sweepstakes casinos, updated regularly.",
  keywords: ["casino bonuses", "crypto promotions", "sweepstakes offers", "no deposit bonuses", "best gambling bonuses", "GMBL", "Gamblementor"],
  authors: [{ name: "GMBL Team" }],
  creator: "GambleMentor Networks",
  publisher: "GambleMentor Networks",
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
    title: "Exclusive Casino Bonuses – GambleMentor Network",
    description: "Access the latest bonuses for crypto and sweepstakes casinos, updated regularly.",
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
    title: "Exclusive Casino Bonuses – GambleMentor Network",
    description: "Access the latest bonuses for crypto and sweepstakes casinos, updated regularly.",
    images: [`${baseUrl}/images/twitter-image.jpg`],
    creator: "@gamblementor",
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

export default async function BonusesPage() {
  return (
    <Layout>
      <BonusesClientPage />
    </Layout>
  );
}
