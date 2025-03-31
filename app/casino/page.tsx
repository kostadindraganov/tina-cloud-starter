"use client";

import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import { getInitialCasinoData } from "@/store";
import CasinoSearch from "@/components/casino/CasinoSearch";

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
  try {
    // Fetch ALL casino data directly (server-side)
    // The client component will handle sorting and pagination
    const storeProps = await getInitialCasinoData();

    // Explicitly set default sort to "Review Count (High to Low)"
    const defaultSort = 'casino_review_count';
    const defaultOrder = 'desc';

    return (
      <Layout rawPageData={storeProps.data}>
        {/* Hero Section with Smooth Transition */}
     
        <div className="relative w-full">
          {/* Animated Border */}
          {/* <div className="w-full h-2 bg-gradient-to-r from-green-500 via-pink-400 to-purple-600 animate-gradient-x"></div> */}

          <div id="hero" className="w-full h-[400px] relative shadow-lg bg-[url('https://res.cloudinary.com/dknctjjlc/image/upload/v1743377004/Hero/piclumen-1743376883272_dpzyfo.png')] bg-cover bg-bottom bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-black/60 before:z-0">
            <div className="container mx-auto h-full flex flex-col justify-center items-center px-4 md:px-8 relative z-10">
              <h1 className="text-4xl font-bold text-white mb-6 text-center">Find Your Perfect Casino</h1>
              <div className="w-full max-w-3xl">
                <CasinoSearch 
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
            
            {/* Dice Icons */}
            <div className="absolute w-full -top-10 z-20">
          
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
  } catch (error) {
    console.error('Error fetching casino data:', error);
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Casinos</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">
              Error loading casino data: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            {process.env.NODE_ENV === 'development' && error instanceof Error && (
              <pre className="mt-2 text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}
