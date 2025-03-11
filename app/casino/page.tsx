import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import client from "@/tina/__generated__/client";

const ITEMS_PER_PAGE = 10;

export default async function CasinoPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  try {
    // First get total count
    const totalPosts = await client.queries.casinoConnection({
      sort: "casino_review_count",
    });

    const totalItems = totalPosts.data.casinoConnection.totalCount;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Then get the actual page data
    const posts = await client.queries.casinoConnection({
      first: ITEMS_PER_PAGE,
      sort: "casino_review_count",
      after: currentPage > 1
        ? await getCursorForPage(currentPage - 1, ITEMS_PER_PAGE)
        : undefined,
    });

    const enhancedPosts = {
      ...posts,
      data: {
        ...posts.data,
        _pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE
        }
      }
    };

    return (
      <Layout rawPageData={posts.data}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Casinos</h1>
          <CasinoClientPage {...enhancedPosts} />
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

async function getCursorForPage(page: number, itemsPerPage: number): Promise<string | undefined> {
  if (page < 1) return undefined;

  const response = await client.queries.casinoConnection({
    first: itemsPerPage * page,
    sort: "-casino_review_count",
  });

  const edges = response.data.casinoConnection.edges;
  if (!edges?.length) return undefined;

  const lastEdge = edges[edges.length - 1];
  return lastEdge?.cursor;
}
