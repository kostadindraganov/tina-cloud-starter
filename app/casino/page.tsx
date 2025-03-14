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
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Casinos</h1>
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
