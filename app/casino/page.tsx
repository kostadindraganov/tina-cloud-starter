import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import { getInitialCasinoData } from "@/store";

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
          {/* Hero Image */}
          <div className="w-full h-[700px] relative ">
            <img
              src="https://res.cloudinary.com/dknctjjlc/image/upload/v1742170105/Hero/piclumen-1742170072104_erz8ii.png"
              alt="Casino Hero"
              className="w-full h-full object-cover  "
            />
            {/* Glass Effect Card - Left Positioned */}
            {/* <div className="absolute inset-y-0 right-10 flex items-center pl-8 md:pl-16">
              <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 rounded-xl p-6 shadow-lg border border-white/20 max-w-md">
                <h1 className="text-4xl font-bold text-white dark:text-white">
                  Casino Explorer
                </h1>
                <p className="text-white/90 dark:text-white/90 mt-4">
                  Discover the best casino experiences
                </p>
              </div>
            </div> */}
            {/* Gradient Overlay for Smooth Transition */}
            {/* <div 
              className="absolute inset-x-0 bottom-0 h-10" 
              style={{ 
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 100%)' 
              }}
            ></div> */}
          </div>
        </div>

        <div className="w-full mx-auto px-4 py-16">
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
