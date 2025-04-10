import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import { getInitialCasinoData } from "@/store";
import SearchWrapper from "./search-wrapper";
import Image from "next/image";

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

  return (
    <Layout rawPageData={storeProps.data}>
      {/* Hero Section with Smooth Transition */}
      <div className="relative w-full">
        <div id="hero" className="w-full h-[400px] relative shadow-lg">
          {/* Hero Background Image */}
          <Image
            src="https://res.cloudinary.com/dknctjjlc/image/upload/v1743377004/Hero/piclumen-1743376883272_dpzyfo.png"
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
