import React, { Suspense } from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import SweepstakesClientPage from "./client-page";
import { getInitialSweepstakesData } from "@/store";
import SearchWrapper from "./search-wrapper";
import Image from "next/image";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';

// Create URL in a way that's stable between server and client
const metadataBaseUrl = new URL(baseUrl);

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: "Leading Sweepstakes Casinos – GambleMentor Networks",
    template: "%s | GMBL",
  },
  description: "Find legitimate sweepstakes casinos offering free games and real prizes.",
  keywords: ["sweepstakes casinos", "free casino games", "win real prizes", "social casinos", "best sweepstake casinos in usa", "submit sweepstakes", "submit sweepstakes casino", "sweepstakes casino directory", "best sweepstakes casinos","GMBL", "Gamblementor"],
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
    title: "Leading Sweepstakes Casinos – GambleMentor Networks",
    description: "Find legitimate sweepstakes casinos offering free games and real prizes.",
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
    title: "Leading Sweepstakes Casinos – GambleMentor Networks",
    description: "Find legitimate sweepstakes casinos offering free games and real prizes.",
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

export default async function SweepstakesPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    search?: string; 
    sort?: 'title' | 'sweepstakes_review_count';
    order?: 'asc' | 'desc';
  };
}) {
  // Fetch ALL sweepstakes data directly (server-side)
  // The client component will handle sorting and pagination
  const storeProps = await getInitialSweepstakesData();

  // Explicitly set default sort to "Review Count (High to Low)"
  const defaultSort = 'sweepstakes_review_count';
  const defaultOrder = 'desc';

  return (
    <Layout rawPageData={storeProps.data}>
      {/* Hero Section with Smooth Transition */}
      <div className="relative w-full">
        <div id="hero" className="w-full h-[400px] relative shadow-lg">
          {/* Hero Background Image */}
          <Image
            src="https://res.cloudinary.com/dknctjjlc/image/upload/v1743377004/Hero/piclumen-1743376883272_dpzyfo.png"
            alt="Sweepstakes Hero Background"
            fill
            priority
            className="object-cover object-bottom"
            quality={90}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 z-0" />
          
          <div className="container mx-auto h-full flex flex-col justify-center items-center px-4 md:px-8 relative z-10">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">Find Your Perfect Sweepstakes</h1>
            <div className="w-full max-w-3xl">
              <SearchWrapper 
                placeholder="Search sweepstakes by name, features or bonuses..." 
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Full-width Divider with Glass Effect */}
        <div className="relative w-full">
          {/* Glass Separator */}
          <div className="absolute w-full -top-4 z-2">
            <div className="h-8 bg-white/30 backdrop-blur-sm border-t border-b border-white/20 shadow-lg"></div>
          </div>
          
          {/* Icons */}
          <div className="absolute w-full -top-10 z-20">
        
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 md:px-8 py-16">
        <Suspense fallback={<div className="w-full h-96 animate-pulse bg-gray-100 rounded-lg"></div>}>
          {storeProps.data && (
            <SweepstakesClientPage 
              data={storeProps.data.data}
              variables={storeProps.data.variables || {}} 
              query={storeProps.data.query || ""}
              initialPage={Number(searchParams.page) || 1}
              initialSearch={searchParams.search || ''}
              initialSort={searchParams.sort as 'title' | 'sweepstakes_review_count' || defaultSort}
              initialOrder={searchParams.order as 'asc' | 'desc' || defaultOrder}
            />
          )}
        </Suspense>
      </div>
    </Layout>
  );
}
