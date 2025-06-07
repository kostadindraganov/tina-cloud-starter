import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import { getInitialCasinoData } from "@/store";
import SearchWrapper from "./search-wrapper";
import Image from "next/image";
import { 
  WebsiteSchema, 
  OrganizationSchema, 
  CollectionPageSchema, 
  BreadcrumbSchema 
} from '@/components/structured-data';

import { Metadata } from "next";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Best Crypto Casinos 2025 – GambleMentor Network",
    template: "%s | GMBL",
  },
  description: "Explore top-rated crypto casinos accepting Bitcoin and Ethereum with secure gameplay.",
  keywords: ["crypto casinos", "bitcoin gambling", "ltc casinos", "blockchain gaming", "casino reviews site", "list casino", "casinos directory", "GMBL", "Gamblementor"],
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
    title: "Best Crypto Casinos 2025 – GambleMentor Network",
    description: "Explore top-rated crypto casinos accepting Bitcoin and Ethereum with secure gameplay.",
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
    title: "Best Crypto Casinos 2025 – GambleMentor Network",
    description: "Explore top-rated crypto casinos accepting Bitcoin and Ethereum with secure gameplay.",
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

export default async function CasinoPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    search?: string; 
    sort?: 'title' | 'casino_review_count';
    order?: 'asc' | 'desc';
  };
}) {
  // Fetch ALL casino data directly (server-side)
  // The client component will handle sorting and pagination
  const storeProps = await getInitialCasinoData();

  // Explicitly set default sort to "Review Count (High to Low)"
  const defaultSort = 'casino_review_count';
  const defaultOrder = 'desc';

  // Generate casino collection items for structured data
  const casinoItems = storeProps.data?.data?.casinoConnection?.edges
    ?.map((edge, index) => {
      const casino = edge?.node;
      if (!casino) return null;
      
      const breadcrumbs = casino._sys?.breadcrumbs || [];
      const casinoUrl = `${baseUrl}/casino/${breadcrumbs.join("/")}`;
      
      return {
        name: casino.title || 'Casino',
        url: casinoUrl,
        description: casino.excerpt || casino.title || ''
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 20) || []; // Limit to first 20 for performance

  return (
    <Layout rawPageData={storeProps.data}>
      {/* Structured Data for Casino Directory */}
      <WebsiteSchema
        url={baseUrl}
        name="GambleMentor Network"
        description="Leading source for casino news, gambling guides, crypto casino reviews, and sweepstakes strategies."
        searchUrl={`${baseUrl}/search`}
      />
      
      <OrganizationSchema
        name="GambleMentor Networks"
        url={baseUrl}
        logo={`${baseUrl}/logo/logo.png`}
        description="Leading source for casino news, gambling guides, and crypto casino tips."
        socialMedia={[
          "https://twitter.com/gamblementor",
          "https://facebook.com/gamblementor"
        ]}
      />
      
      <CollectionPageSchema
        name="Best Crypto Casinos 2025 – GambleMentor Network"
        description="Explore top-rated crypto casinos accepting Bitcoin and Ethereum with secure gameplay."
        url={`${baseUrl}/casino`}
        numberOfItems={storeProps.data?.data?.casinoConnection?.totalCount || 0}
        items={casinoItems}
        provider={{
          name: "GambleMentor Networks",
          url: baseUrl
        }}
      />
      
      <BreadcrumbSchema
        breadcrumbs={[
          { name: "Home", url: baseUrl, position: 1 },
          { name: "Casinos", url: `${baseUrl}/casino`, position: 2 }
        ]}
      />

      {/* Hero Section with Smooth Transition */}
      <div className="relative w-full">
        <div id="hero" className="w-full h-[400px] relative shadow-lg">
          {/* Hero Background Image */}
          <Image
            src="/uploads/Hero/piclumen-1743376883272_dpzyfo.png"
            alt="Casino Hero Background"
            fill
            priority
            className="object-cover object-bottom"
            quality={90}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 z-0" />
          
          <div className="container mx-auto h-full flex flex-col justify-center items-center px-4 md:px-8 relative z-10">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">Find Your Perfect Casino</h1>
            <div className="w-full max-w-3xl">
              <SearchWrapper 
                placeholder="Search by name, features or bonuses..." 
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Full-width Dice Divider with Glass Effect */}
        <div className="relative w-full">
          {/* Glass Separator */}
          <div className="absolute w-full -top-4 z-2">
            <div className="h-8 bg-white/30 backdrop-blur-sm border-t border-b border-white/20 shadow-lg"></div>
          </div>
        
        </div>
      </div>

      <div className="w-full mx-auto px-4 md:px-8 py-16">
        <CasinoClientPage 
          {...storeProps} 
          initialPage={Number(searchParams.page) || 1}
          initialSearch={searchParams.search || ''}
          initialSort={searchParams.sort as 'title' | 'casino_review_count' || defaultSort}
          initialOrder={searchParams.order as 'asc' | 'desc' || defaultOrder}
        />
      </div>
    </Layout>
  );
}
